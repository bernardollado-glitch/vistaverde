const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

const source = fs.readFileSync(path.join(__dirname, '../src/estadoCultivo.ts'), 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText
const context = { exports: {} }
vm.runInNewContext(compiled, context)
const { EstadoCultivo: E, estadoCultivo, interactuarCultivo } = context.exports
const inicio = 1791460000000
const vacia = { plantada: false, sembradaEn: 0, cosechas: 0 }

test('siembra, crecimiento, cosecha única y nueva siembra', () => {
  const sembrada = interactuarCultivo(vacia, inicio)
  assert.equal(estadoCultivo(sembrada, inicio + 9999), E.CRECIENDO)
  assert.equal(interactuarCultivo(sembrada, inicio + 9999), undefined)
  assert.equal(estadoCultivo(sembrada, inicio + 10000), E.LISTA)
  const cosechada = interactuarCultivo(sembrada, inicio + 10000)
  assert.equal(cosechada.cosechas, 1)
  assert.equal(estadoCultivo(cosechada, inicio + 10001), E.VACIA)
  const resembrada = interactuarCultivo(cosechada, inicio + 10001)
  assert.equal(resembrada.cosechas, 1)
  assert.equal(estadoCultivo(resembrada, inicio + 10001), E.CRECIENDO)
})

test('llegada tardía obtiene madurez o marchitado del instante de siembra', () => {
  const sembrada = interactuarCultivo(vacia, inicio)
  const recibido = JSON.parse(JSON.stringify(sembrada))
  assert.equal(estadoCultivo(recibido, inicio + 24000), E.LISTA)
  assert.equal(estadoCultivo(recibido, inicio + 25000), E.MARCHITA)
  const limpia = interactuarCultivo(recibido, inicio + 25000)
  assert.equal(limpia.plantada, false)
  assert.equal(limpia.cosechas, 0)
})

test('dos cosechas simultáneas del mismo estado producen un solo incremento', () => {
  const sembrada = interactuarCultivo(vacia, inicio)
  const a = interactuarCultivo(sembrada, inicio + 10000)
  const b = interactuarCultivo(sembrada, inicio + 10000)
  assert.equal(a.cosechas, 1)
  assert.equal(b.cosechas, 1)
  assert.equal(JSON.stringify(a), JSON.stringify(b))
})

test('cosechas en canteros distintos se suman sin escribir un contador común', () => {
  const a = interactuarCultivo(interactuarCultivo(vacia, inicio), inicio + 10000)
  const b = interactuarCultivo(interactuarCultivo(vacia, inicio + 1000), inicio + 11000)
  assert.equal(a.cosechas + b.cosechas, 2)
})

test('un reloj anterior al instante recibido no adelanta el cultivo', () => {
  const sembrada = interactuarCultivo(vacia, inicio)
  assert.equal(estadoCultivo(sembrada, inicio - 1000), E.CRECIENDO)
})

test('una cubeta por cultivo: no permite volver a regar ni regar vacías o marchitas', () => {
  const { regarCultivo, humedadRestante } = context.exports
  assert.equal(regarCultivo(vacia, inicio), undefined)
  const sembrada = interactuarCultivo(vacia, inicio)
  const regada = regarCultivo(sembrada, inicio + 1000)
  assert.equal(humedadRestante(regada, inicio + 1000), 12)
  assert.equal(regarCultivo(regada, inicio + 2000), undefined)
  assert.equal(humedadRestante(regada, inicio + 13000), 0)
  assert.equal(regarCultivo(regada, inicio + 13000), undefined)
  assert.equal(regarCultivo(regada, inicio + 25000), undefined)
  const cosechada = interactuarCultivo(regada, inicio + 10000)
  assert.equal(cosechada.regadaEn, 0)
  assert.equal(humedadRestante(cosechada, inicio + 10000), 0)
})
