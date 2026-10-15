const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function loader(mocks = {}) {
  const cache = new Map()
  return function load(file) {
    file = path.resolve(file)
    if (cache.has(file)) return cache.get(file)
    const exports = {}
    cache.set(file, exports)
    const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    }).outputText
    vm.runInNewContext(compiled, {
      exports, console: { log() {}, error() {} },
      require: name => mocks[name] || load(path.resolve(path.dirname(file), name + '.ts'))
    })
    return exports
  }
}
const root = path.join(__dirname, '../src')
const { leerGranja, granjaVacia, aplicarAccion, ColaGuardado } = loader()(path.join(root, 'granjaGuardada.ts'))

test('recupera cosechas y tiempos de los cuatro canteros', () => {
  const granja = granjaVacia()
  granja.parcelas[2] = { plantada: true, sembradaEn: 1791460000000, cosechas: 6 }
  const recuperada = leerGranja(JSON.stringify(granja))
  assert.equal(recuperada.parcelas[2].sembradaEn, 1791460000000)
  assert.equal(recuperada.parcelas[2].cosechas, 6)
  assert.equal(leerGranja(null).parcelas.length, 4)
})

test('rechaza datos corruptos o versiones desconocidas sin tratarlos como ausencia', () => {
  for (const raw of [undefined, '{}', 'no json', '{"version":2,"parcelas":[]}',
    JSON.stringify({ version: 1, parcelas: Array(4).fill({ plantada: true, sembradaEn: 0, cosechas: -1 }) })]) {
    assert.throws(() => leerGranja(raw))
  }
})

test('el servidor acepta una sola cosecha ante peticiones duplicadas', () => {
  const granja = granjaVacia()
  const ahora = 1791460000000
  assert.equal(aplicarAccion(granja, 0, { ...granja.parcelas[0] }, ahora), true)
  const observado = { ...granja.parcelas[0] }
  assert.equal(aplicarAccion(granja, 0, observado, ahora + 10000), true)
  assert.equal(aplicarAccion(granja, 0, observado, ahora + 10000), false)
  assert.equal(granja.parcelas[0].cosechas, 1)
  assert.equal(aplicarAccion(granja, -1, observado, ahora), false)
})

test('un fallo conserva los cambios pendientes y reintenta', async () => {
  const cola = new ColaGuardado()
  cola.marcarCambio()
  await cola.guardar(granjaVacia(), async () => false)
  assert.equal(cola.pendiente, true)
  assert.equal(cola.error, true)
  await cola.guardar(granjaVacia(), async () => { throw new Error('sin conexión') })
  assert.equal(cola.pendiente, true)
  await cola.guardar(granjaVacia(), async () => true)
  assert.equal(cola.pendiente, false)
  assert.equal(cola.error, false)
})

test('serializa escrituras y no pierde cambios recibidos durante el guardado', async () => {
  const cola = new ColaGuardado()
  const granja = granjaVacia()
  let resolver
  let llamadas = 0
  cola.marcarCambio()
  const pendiente = cola.guardar(granja, raw => {
    llamadas++
    assert.equal(JSON.parse(raw).parcelas[0].cosechas, 0)
    return new Promise(resolve => { resolver = resolve })
  })
  granja.parcelas[0].cosechas = 1
  cola.marcarCambio()
  await cola.guardar(granja, async () => { llamadas++; return true })
  assert.equal(llamadas, 1)
  resolver(true)
  await pendiente
  assert.equal(cola.pendiente, true)
  await cola.guardar(granja, async raw => {
    assert.equal(JSON.parse(raw).parcelas[0].cosechas, 1)
    return true
  })
  assert.equal(cola.pendiente, false)
})

function servidor(raw) {
  const tareas = []
  const sistemas = []
  const escritos = []
  const posiciones = new Map([[900, { position: { x: 6, y: 0, z: 4 } }]])
  const jugadores = new Map([[900, { address: '0xabc' }]])
  let id = 512
  function componente() {
    const datos = new Map()
    return { datos, create: (e, v) => datos.set(e, v), createOrReplace: (e, v) => datos.set(e, v),
      getMutable: e => datos.get(e), validateBeforeChange() {}, componentId: id++ }
  }
  const GranjaCompartida = componente()
  const EstadoServidor = componente()
  const handlers = {}
  const mocks = {
    '@dcl/sdk/ecs': { engine: { addEntity: () => id++, addSystem: s => sistemas.push(s), getEntitiesWith: () => jugadores },
      PlayerIdentityData: {}, Transform: { getOrNull: e => posiciones.get(e) },
      executeTask: f => tareas.push(Promise.resolve().then(f)) },
    '@dcl/sdk/network': { syncEntity() {} },
    '@dcl/sdk/network/message-bus-sync': { AUTH_SERVER_PEER_ID: 'server' },
    '@dcl/sdk/server': { Storage: { get: async () => raw, set: async (key, value) => { escritos.push(value); return true } } },
    '../shared/granja': { GranjaCompartida, EstadoServidor, room: { onMessage: (name, f) => { handlers[name] = f } } }
  }
  loader(mocks)(path.join(root, 'server/granja.ts')).iniciarServidor()
  return { tareas, sistemas, escritos, GranjaCompartida, EstadoServidor, handlers, posiciones }
}

test('servidor completo carga, valida proximidad, guarda y recupera en un nuevo arranque', async () => {
  const a = servidor(null)
  await Promise.all(a.tareas)
  const parcelas = [...a.GranjaCompartida.datos.values()][0].parcelas
  const peticion = { parcela: 0, ...parcelas[0] }
  a.posiciones.set(900, { position: { x: 100, y: 0, z: 100 } })
  a.handlers.interactuar(peticion, { from: '0xabc' })
  assert.equal([...a.GranjaCompartida.datos.values()][0].parcelas[0].plantada, false)
  a.posiciones.set(900, { position: { x: 6, y: 0, z: 4 } })
  a.handlers.interactuar(peticion, { from: '0xabc' })
  a.sistemas[0](2)
  await Promise.all(a.tareas)
  assert.equal(a.escritos.length, 1)
  assert.equal([...a.EstadoServidor.datos.values()][0].guardado, 'Progreso guardado')
  const b = servidor(a.escritos[0])
  await Promise.all(b.tareas)
  assert.equal([...b.GranjaCompartida.datos.values()][0].parcelas[0].plantada, true)
  assert.equal([...b.EstadoServidor.datos.values()][0].lista, true)
})

test('servidor con datos corruptos bloquea acciones y nunca sobrescribe el registro', async () => {
  const a = servidor('datos corruptos')
  await Promise.all(a.tareas)
  a.handlers.interactuar({ parcela: 0, plantada: false, sembradaEn: 0, cosechas: 0 }, { from: '0xabc' })
  a.sistemas[0](5)
  await Promise.all(a.tareas)
  assert.equal(a.escritos.length, 0)
  assert.equal([...a.EstadoServidor.datos.values()][0].lista, false)
})

test('migra guardados sin riego conservando cosechas y valida timestamps de agua', () => {
  const antigua = { version: 1, parcelas: Array.from({ length: 4 }, () => ({ plantada: true, sembradaEn: 1000, cosechas: 7 })) }
  const recuperada = leerGranja(antigua)
  assert.equal(recuperada.parcelas[0].regadaEn, 0)
  assert.equal(recuperada.parcelas[0].cosechas, 7)
  antigua.parcelas[0].regadaEn = 900
  assert.throws(() => leerGranja(antigua))
})

test('riego cooperativo rechaza peticiones duplicadas y conserva agua tras guardar', () => {
  const granja = granjaVacia()
  const ahora = 1791460000000
  aplicarAccion(granja, 0, { ...granja.parcelas[0] }, ahora)
  const observado = { ...granja.parcelas[0] }
  assert.equal(aplicarAccion(granja, 0, observado, ahora + 1000, 'regar'), true)
  assert.equal(aplicarAccion(granja, 0, observado, ahora + 1000, 'regar'), false)
  assert.equal(leerGranja(JSON.stringify(granja)).parcelas[0].regadaEn, ahora + 1000)
})

test('servidor recibe riego, valida distancia y lo guarda', async () => {
  const a = servidor(null)
  await Promise.all(a.tareas)
  const datos = () => [...a.GranjaCompartida.datos.values()][0].parcelas[0]
  a.handlers.interactuar({ parcela: 0, ...datos() }, { from: '0xabc' })
  const peticion = { parcela: 0, ...datos() }
  a.posiciones.set(900, { position: { x: 100, y: 0, z: 100 } })
  a.handlers.regar(peticion, { from: '0xabc' })
  assert.equal(datos().regadaEn, 0)
  a.posiciones.set(900, { position: { x: 6, y: 0, z: 4 } })
  a.handlers.regar(peticion, { from: '0xabc' })
  assert.ok(datos().regadaEn > 0)
  a.sistemas[0](2)
  await Promise.all(a.tareas)
  const b = servidor(a.escritos[0])
  await Promise.all(b.tareas)
  assert.equal([...b.GranjaCompartida.datos.values()][0].parcelas[0].regadaEn, datos().regadaEn)
})
