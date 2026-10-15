import { engine, Entity, executeTask, PlayerIdentityData, Transform } from '@dcl/sdk/ecs'
import { syncEntity } from '@dcl/sdk/network'
import { AUTH_SERVER_PEER_ID } from '@dcl/sdk/network/message-bus-sync'
import { Storage } from '@dcl/sdk/server'
import { DatosCultivo } from '../estadoCultivo'
import { GranjaCompartida, EstadoServidor, room } from '../shared/granja'
import { CLAVE_GRANJA, POSICIONES, GranjaGuardada, leerGranja, aplicarAccion, ColaGuardado } from '../granjaGuardada'

export function iniciarServidor() {
  GranjaCompartida.validateBeforeChange(v => v.senderAddress === AUTH_SERVER_PEER_ID)
  EstadoServidor.validateBeforeChange(v => v.senderAddress === AUTH_SERVER_PEER_ID)
  const estado = engine.addEntity()
  EstadoServidor.create(estado, { heartbeat: Date.now(), ahora: Date.now(), lista: false, guardado: 'Cargando granja...' })
  syncEntity(estado, [EstadoServidor.componentId], 101)
  let entidadGranja: Entity | undefined
  let granja: GranjaGuardada | undefined
  let cargando = false
  let cargaFallida = false
  let pulso = 0
  let intervalo = 0
  let reintento = 0
  const cola = new ColaGuardado()

  function publicarGuardado() {
    EstadoServidor.getMutable(estado).guardado = cola.error
      ? 'Error al guardar. Reintentando...'
      : cola.pendiente ? 'Guardando cambios...' : 'Progreso guardado'
  }

  function guardar() {
    if (!granja) return
    const actual = granja
    executeTask(async () => {
      await cola.guardar(actual, raw => Storage.set(CLAVE_GRANJA, raw))
      publicarGuardado()
    })
  }

  function cargar() {
    if (cargando || granja) return
    cargando = true
    executeTask(async () => {
      try {
        const raw = await Storage.get<unknown>(CLAVE_GRANJA, { fresh: true })
        granja = leerGranja(raw)
        entidadGranja = engine.addEntity()
        GranjaCompartida.create(entidadGranja, { parcelas: granja.parcelas.map(p => ({ ...p, regadaEn: p.regadaEn ?? 0 })) })
        syncEntity(entidadGranja, [GranjaCompartida.componentId], 100)
        const status = EstadoServidor.getMutable(estado)
        status.lista = true
        status.ahora = Date.now()
        status.heartbeat = Date.now()
        status.guardado = 'Progreso guardado'
        cargaFallida = false
        console.log('[SERVER] Granja recuperada; cosechas:', granja.parcelas.reduce((s, p) => s + p.cosechas, 0))
      } catch (error) {
        // Nunca inicializar y sobrescribir una granja si la lectura falla.
        cargaFallida = true
        EstadoServidor.getMutable(estado).guardado = 'No se pudo cargar. Reintentando...'
        console.error('[SERVER] Error recuperando granja:', error)
      } finally {
        cargando = false
      }
    })
  }

  function recibir(data: DatosCultivo & { parcela: number }, context: { from: string } | undefined, accion: 'interactuar' | 'regar') {
    if (!context || !granja || entidadGranja === undefined) return
    const posicion = POSICIONES[data.parcela]
    if (!posicion) return
    let cerca = false
    for (const [entidad, identidad] of engine.getEntitiesWith(PlayerIdentityData)) {
      if (identidad.address.toLowerCase() !== context.from.toLowerCase()) continue
      const transform = Transform.getOrNull(entidad)
      if (transform) {
        const p = transform.position
        cerca = (p.x - posicion.x) ** 2 + (p.z - posicion.z) ** 2 + (p.y - posicion.y) ** 2 <= 36
      }
      break
    }
    if (!cerca || !aplicarAccion(granja, data.parcela, data, Date.now(), accion)) return
    GranjaCompartida.createOrReplace(entidadGranja, { parcelas: granja.parcelas.map(p => ({ ...p, regadaEn: p.regadaEn ?? 0 })) })
    cola.marcarCambio()
    publicarGuardado()
  }
  room.onMessage('interactuar', (data, context) => recibir(data, context, 'interactuar'))
  room.onMessage('regar', (data, context) => recibir(data, context, 'regar'))

  engine.addSystem(dt => {
    pulso += dt
    intervalo += dt
    reintento += dt
    if (pulso >= 2) {
      pulso = 0
      const status = EstadoServidor.getMutable(estado)
      status.heartbeat = Date.now()
      status.ahora = Date.now()
    }
    if (intervalo >= 2) {
      intervalo = 0
      if (cola.pendiente) guardar()
    }
    if (cargaFallida && reintento >= 5) {
      reintento = 0
      cargar()
    }
  })
  cargar()
}
