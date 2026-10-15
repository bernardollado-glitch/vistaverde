import {
  engine, Entity, Transform, MeshRenderer, MeshCollider, ColliderLayer,
  Material, pointerEventsSystem, InputAction
} from '@dcl/sdk/ecs'
import { Color4, Quaternion } from '@dcl/sdk/math'

export type Lechuga = {
  raiz: Entity
  entidades: Entity[]
  hojas: Entity[]
  interactuar: () => void
}

// Hojas redondeadas en dos coronas: cultivo creado únicamente al sembrar.
export function crearLechuga(parcela: Entity, interactuar: () => void): Lechuga {
  const { position, scale } = Transform.get(parcela)
  const raiz = engine.addEntity()
  Transform.create(raiz, {
    position: { x: position.x, y: position.y + scale.y / 2 + 0.015, z: position.z },
    scale: { x: 0.2, y: 0.2, z: 0.2 }
  })
  const lechuga: Lechuga = { raiz, entidades: [raiz], hojas: [], interactuar }

  for (let corona = 0; corona < 2; corona++) {
    const cantidad = corona === 0 ? 7 : 5
    for (let i = 0; i < cantidad; i++) {
      const angulo = i * Math.PI * 2 / cantidad + corona * 0.4
      const radio = corona === 0 ? 0.19 : 0.08
      const hoja = engine.addEntity()
      lechuga.entidades.push(hoja)
      lechuga.hojas.push(hoja)
      Transform.create(hoja, {
        parent: raiz,
        position: { x: Math.sin(angulo) * radio, y: corona === 0 ? 0.12 : 0.25, z: Math.cos(angulo) * radio },
        rotation: Quaternion.fromEulerDegrees(corona === 0 ? -18 : -35, angulo * 180 / Math.PI, 0),
        scale: { x: corona === 0 ? 0.29 : 0.25, y: 0.15, z: corona === 0 ? 0.42 : 0.32 }
      })
      MeshRenderer.setSphere(hoja)
      MeshCollider.setSphere(hoja, ColliderLayer.CL_POINTER)
      Material.setBasicMaterial(hoja, {
        diffuseColor: Color4.fromHexString(corona === 0 ? (i % 2 ? '#409C39' : '#56B943') : '#91DE58')
      })
      pointerEventsSystem.onPointerDown(
        { entity: hoja, opts: { button: InputAction.IA_POINTER, hoverText: 'Lechuga creciendo' } },
        interactuar
      )

      // Nervadura clara que refuerza la lectura de hoja sin texturas externas.
      const nervadura = engine.addEntity()
      lechuga.entidades.push(nervadura)
      Transform.create(nervadura, {
        parent: hoja,
        position: { x: 0, y: 0.43, z: 0 },
        scale: { x: 0.07, y: 0.16, z: 0.78 }
      })
      MeshRenderer.setSphere(nervadura)
      Material.setBasicMaterial(nervadura, { diffuseColor: Color4.fromHexString('#C6ED88') })
    }
  }
  return lechuga
}

export function crecerLechuga(lechuga: Lechuga, progreso: number) {
  const tamano = 0.2 + 0.8 * Math.max(0, Math.min(1, progreso))
  Transform.getMutable(lechuga.raiz).scale = { x: tamano, y: tamano, z: tamano }
}

export function prepararCosecha(lechuga: Lechuga) {
  crecerLechuga(lechuga, 1)
  for (const hoja of lechuga.hojas) {
    pointerEventsSystem.onPointerDown(
      { entity: hoja, opts: { button: InputAction.IA_POINTER, hoverText: 'Cosechar lechuga' } },
      lechuga.interactuar
    )
  }
}

export function marchitarLechuga(lechuga: Lechuga) {
  Transform.getMutable(lechuga.raiz).scale = { x: 1.05, y: 0.35, z: 1.05 }
  for (const entidad of lechuga.entidades.slice(1)) {
    Material.setBasicMaterial(entidad, { diffuseColor: Color4.fromHexString('#947044') })
  }
  for (const hoja of lechuga.hojas) {
    pointerEventsSystem.onPointerDown(
      { entity: hoja, opts: { button: InputAction.IA_POINTER, hoverText: 'Limpiar lechuga marchita' } },
      lechuga.interactuar
    )
  }
}

export function eliminarLechuga(lechuga: Lechuga) {
  for (const hoja of lechuga.hojas) pointerEventsSystem.removeOnPointerDown(hoja)
  for (const entidad of [...lechuga.entidades].reverse()) engine.removeEntity(entidad)
}
