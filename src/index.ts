import {
  engine,
  Entity,
  Transform,
  MeshRenderer,
  MeshCollider,
  ColliderLayer,
  pointerEventsSystem,
  InputAction,
  Material,
  executeTask,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { actualizarMetaComunitaria } from './metaComunitaria'
import { isServer, isStateSyncronized } from '@dcl/sdk/network'
import { GranjaCompartida, EstadoServidor, room } from './shared/granja'
import { POSICIONES } from './granjaGuardada'
import { crearRiego, actualizarRiego, IndicadorRiego } from './riego'
import { setupUi } from './ui'
import { state as estadoUi } from './ui/EstadoGuardado'
import { EstadoCultivo, TIEMPO_CRECIMIENTO, TIEMPO_PARA_MARCHITAR, estadoCultivo } from './estadoCultivo'
import { decorarCantero } from './cantero'
import { crearEspantapajaros } from './espantapajaros'
import { Carteles, crearCarteles, actualizarCarteles } from './carteles'
import { BarraProgreso, crearBarraProgreso, actualizarBarraProgreso, eliminarBarraProgreso } from './barraProgreso'
import { Lechuga, crearLechuga, crecerLechuga, prepararCosecha, marchitarLechuga, eliminarLechuga } from './lechuga'

// Plantas y barras son representaciones locales de los datos compartidos.
const parcelas = new Map<Entity, {
  indice: number
  estado: EstadoCultivo
  sembradaEn: number
  riego: IndicadorRiego
  barra?: BarraProgreso
  lechuga?: Lechuga
}>()

let carteles: Carteles
let ultimoPulso: number | undefined
let observadoEn = 0
let relojServidor = 0
let primerPulsoNuevo = false
let lista = false

export async function main() {
  if (isServer()) {
    const { iniciarServidor } = await import('./server/granja')
    iniciarServidor()
    return
  }
  for (let i = 0; i < POSICIONES.length; i++) {
    const p = POSICIONES[i]
    crearParcela(p.x, p.y, p.z, i)
  }
  carteles = crearCarteles()
  crearEspantapajaros()
  setupUi()
  engine.addSystem(actualizarGranja)
}

function crearParcela(x: number, y: number, z: number, indice: number) {
  const parcela = engine.addEntity()

  Transform.create(parcela, {
    position: { x, y, z },
    scale: { x: 0.82, y: 0.06, z: 0.82 }
  })

  MeshRenderer.setCylinder(parcela, 0.5, 0.5)
  MeshCollider.setCylinder(parcela, 0.5, 0.5, ColliderLayer.CL_POINTER)

  Material.setBasicMaterial(parcela, {
    diffuseColor: Color4.fromHexString('#725744')
  })
  decorarCantero(parcela, () => interactuarConParcela(parcela))

  parcelas.set(parcela, { indice, estado: EstadoCultivo.VACIA, sembradaEn: 0, riego: crearRiego(x, z, () => interactuarConParcela(parcela, 'regar')) })

  pointerEventsSystem.onPointerDown(
    {
      entity: parcela,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Interactuar' }
    },
    () => interactuarConParcela(parcela)
  )
}

function interactuarConParcela(parcela: Entity, accion: 'interactuar' | 'regar' = 'interactuar') {
  if (!lista || !isStateSyncronized() || Date.now() - observadoEn > 6000) return
  const visual = parcelas.get(parcela)
  if (!visual) return
  for (const [, granja] of engine.getEntitiesWith(GranjaCompartida)) {
    const datos = granja.parcelas[visual.indice]
    if (datos) executeTask(async () => {
      await room.send(accion, { parcela: visual.indice, ...datos, regadaEn: datos.regadaEn ?? 0 })
    })
    break
  }
}

function actualizarGranja(dt: number) {
  relojServidor += dt * 1000
  lista = false
  if (!isStateSyncronized()) {
    estadoUi.mensaje = 'Conectando con la granja...'
    return
  }
  for (const [, status] of engine.getEntitiesWith(EstadoServidor)) {
    if (ultimoPulso === undefined) {
      ultimoPulso = status.heartbeat
      // La primera lectura puede ser una instantánea de un servidor anterior.
    } else if (ultimoPulso !== status.heartbeat) {
      ultimoPulso = status.heartbeat
      observadoEn = Date.now()
      relojServidor = status.ahora
      primerPulsoNuevo = true
    }
    const activo = primerPulsoNuevo && Date.now() - observadoEn < 6000
    lista = activo && status.lista
    estadoUi.mensaje = activo ? status.guardado : 'Esperando a la granja...'
    break
  }
  if (!lista) return
  let compartida: { parcelas: readonly { plantada: boolean; sembradaEn: number; cosechas: number; regadaEn: number }[] } | undefined
  for (const [, datos] of engine.getEntitiesWith(GranjaCompartida)) { compartida = datos; break }
  if (!compartida || compartida.parcelas.length !== 4) return
  const ahora = relojServidor
  let cosechaTotal = 0
  let marchitas = 0

  for (const [parcela, visual] of parcelas) {
    const datos = compartida.parcelas[visual.indice]
    const estado = estadoCultivo(datos, ahora)
    actualizarRiego(visual.riego, datos, ahora)
    cosechaTotal += datos.cosechas
    if (estado === EstadoCultivo.MARCHITA) marchitas++

    // Recrear la planta al recibir una nueva siembra, incluso si entre dos
    // frames remotos se cosechó y volvió a sembrar el mismo cantero.
    if (visual.sembradaEn !== datos.sembradaEn || estado === EstadoCultivo.VACIA) {
      if (visual.lechuga) eliminarLechuga(visual.lechuga)
      if (visual.barra) eliminarBarraProgreso(visual.barra)
      visual.lechuga = undefined
      visual.barra = undefined
      visual.estado = EstadoCultivo.VACIA
      visual.sembradaEn = datos.sembradaEn
    }

    if (estado !== EstadoCultivo.VACIA && !visual.lechuga) {
      visual.lechuga = crearLechuga(parcela, () => interactuarConParcela(parcela))
      visual.barra = crearBarraProgreso(parcela)
    }

    if (estado !== visual.estado && visual.lechuga) {
      if (estado === EstadoCultivo.LISTA) prepararCosecha(visual.lechuga)
      if (estado === EstadoCultivo.MARCHITA) {
        marchitarLechuga(visual.lechuga)
        if (visual.barra) eliminarBarraProgreso(visual.barra)
        visual.barra = undefined
      }
    }
    visual.estado = estado

    const transcurrido = Math.max(0, (ahora - datos.sembradaEn) / 1000)
    if (estado === EstadoCultivo.CRECIENDO && visual.lechuga) {
      crecerLechuga(visual.lechuga, transcurrido / TIEMPO_CRECIMIENTO)
    }
    if (visual.barra) {
      const lista = estado === EstadoCultivo.LISTA
      const progreso = lista
        ? 1 - (transcurrido - TIEMPO_CRECIMIENTO) / TIEMPO_PARA_MARCHITAR
        : transcurrido / TIEMPO_CRECIMIENTO
      actualizarBarraProgreso(visual.barra, progreso, lista)
    }
  }
  if (carteles) actualizarCarteles(carteles, cosechaTotal, marchitas)
  actualizarMetaComunitaria(cosechaTotal, dt)
}
