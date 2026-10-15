import { engine, Entity, Transform, MeshRenderer, Material, TextShape, Billboard, BillboardMode } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

export const META_COSECHAS = 5

let cumplida = false
let cartel: Entity | undefined
let fondoCartel: Entity | undefined
let tiempo = 0
const destellos: Entity[] = []

// Cada cliente celebra el mismo umbral recibido del contador compartido.
// No se envían eventos efímeros que un jugador nuevo podría perderse.
export function actualizarMetaComunitaria(cosechas: number, dt: number) {
  if (cosechas < META_COSECHAS) {
    if (fondoCartel !== undefined) engine.removeEntity(fondoCartel)
    fondoCartel = undefined
    if (cartel !== undefined) engine.removeEntity(cartel)
    cartel = undefined
    for (const entidad of destellos) engine.removeEntity(entidad)
    destellos.length = 0
    cumplida = false
    tiempo = 0
    return
  }

  if (!cumplida) {
    cumplida = true
    tiempo = 4
    cartel = engine.addEntity()
    Transform.create(cartel, { position: { x: 6, y: 2.2, z: 10 } })
    Billboard.create(cartel, { billboardMode: BillboardMode.BM_ALL })
    fondoCartel = engine.addEntity()
    Transform.create(fondoCartel, {
      parent: cartel,
      position: { x: 0, y: 0, z: 0.04 },
      scale: { x: 3.2, y: 0.65, z: 0.035 }
    })
    MeshRenderer.setBox(fondoCartel)
    Material.setBasicMaterial(fondoCartel, {
      diffuseColor: Color4.fromHexString('#233C2B')
    })
    TextShape.create(cartel, {
      text: '¡Meta comunitaria cumplida!\n5 lechugas entre todos',
      fontSize: 1.2,
      textColor: Color4.fromHexString('#FFF8DF'),
      outlineColor: Color4.fromHexString('#4A3124'),
      outlineWidth: 0.04
    })

    // Efecto breve de colores alrededor del centro, sin colisiones.
    for (let i = 0; i < 12; i++) {
      const entidad = engine.addEntity()
      const angulo = i * Math.PI * 2 / 12
      Transform.create(entidad, {
        position: { x: 6 + Math.cos(angulo) * 1.2, y: 0.7, z: 6 + Math.sin(angulo) * 1.2 },
        scale: { x: 0.09, y: 0.09, z: 0.09 }
      })
      MeshRenderer.setSphere(entidad)
      Material.setBasicMaterial(entidad, {
        diffuseColor: Color4.fromHexString(['#FFE47A', '#66E18B', '#FF8FBA'][i % 3])
      })
      destellos.push(entidad)
    }
  }

  if (tiempo > 0) {
    tiempo = Math.max(0, tiempo - dt)
    for (let i = 0; i < destellos.length; i++) {
      const transform = Transform.getMutable(destellos[i])
      transform.position.y = 0.7 + (4 - tiempo) * 0.55 + Math.sin((4 - tiempo) * 5 + i) * 0.12
      const tamano = 0.09 * Math.min(1, tiempo)
      transform.scale = { x: tamano, y: tamano, z: tamano }
    }
    if (tiempo === 0) {
      for (const entidad of destellos) engine.removeEntity(entidad)
      destellos.length = 0
    }
  }
}
