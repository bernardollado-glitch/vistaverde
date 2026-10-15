import { engine, Entity, Transform, MeshRenderer, MeshCollider, ColliderLayer, Material, AudioSource, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { DatosCultivo, estadoCultivo, EstadoCultivo, humedadRestante } from './estadoCultivo'

export type IndicadorRiego = { boton: Entity; ultimo: string; regadaEn?: number }
export function crearRiego(x: number, z: number, regar: () => void): IndicadorRiego {
  const boton = engine.addEntity()
  Transform.create(boton, { position: { x: x + 0.7, y: 0.3, z }, scale: { x: 0.4, y: 0.3, z: 0.4 } })
  MeshRenderer.setCylinder(boton, 0.5, 0.5)
  MeshCollider.setCylinder(boton, 0.5, 0.5, ColliderLayer.CL_POINTER)
  Material.setBasicMaterial(boton, { diffuseColor: Color4.fromHexString('#8D8270') })
  pointerEventsSystem.onPointerDown({ entity: boton, opts: { button: InputAction.IA_POINTER, hoverText: 'Regar este cantero' } }, regar)
  return { boton, ultimo: '' }
}
export function actualizarRiego(indicador: IndicadorRiego, datos: DatosCultivo, ahora: number) {
  const estado = estadoCultivo(datos, ahora)
  const humedad = humedadRestante(datos, ahora)
  // La primera instantánea no reproduce riegos antiguos al entrar.
  if (indicador.regadaEn !== undefined && datos.regadaEn && datos.regadaEn !== indicador.regadaEn && humedad > 0) {
    AudioSource.playSound(indicador.boton, 'assets/sounds/riego.wav', true)
    AudioSource.getMutable(indicador.boton).volume = 0.35
  }
  indicador.regadaEn = datos.regadaEn ?? 0
  // La cubeta se llena con la siembra y queda vacía después de usarla.
  const color = estado === EstadoCultivo.CRECIENDO && !datos.regadaEn
    ? '#46CBD5' : '#8D8270'
  if (indicador.ultimo === color) return
  indicador.ultimo = color
  Material.setBasicMaterial(indicador.boton, { diffuseColor: Color4.fromHexString(color) })
}
