import { engine, Entity, Transform, MeshRenderer, MeshCollider, ColliderLayer, Material, pointerEventsSystem, InputAction } from '@dcl/sdk/ecs'
import { Color4, Quaternion } from '@dcl/sdk/math'

export function decorarCantero(parcela: Entity, interactuar: () => void) {
  const { position } = Transform.get(parcela)
  const madera = engine.addEntity()
  Transform.create(madera, {
    position: { x: position.x, y: position.y - 0.055, z: position.z },
    scale: { x: 1, y: 0.12, z: 1 }
  })
  MeshRenderer.setCylinder(madera, 0.5, 0.5)
  MeshCollider.setCylinder(madera, 0.5, 0.5, ColliderLayer.CL_POINTER)
  Material.setBasicMaterial(madera, { diffuseColor: Color4.fromHexString('#715846') })
  pointerEventsSystem.onPointerDown(
    { entity: madera, opts: { button: InputAction.IA_POINTER, hoverText: 'Interactuar con el cantero' } },
    interactuar
  )

  // Listones planos tangentes al círculo, con pequeñas juntas entre piezas.
  for (let i = 0; i < 16; i++) {
    const angulo = i * Math.PI * 2 / 16
    const borde = engine.addEntity()
    Transform.create(borde, {
      position: {
        x: position.x + Math.sin(angulo) * 0.45,
        y: position.y + 0.015,
        z: position.z + Math.cos(angulo) * 0.45
      },
      rotation: Quaternion.fromEulerDegrees(0, angulo * 180 / Math.PI, 0),
      scale: { x: 0.168, y: 0.13, z: 0.08 }
    })
    MeshRenderer.setBox(borde)
    Material.setBasicMaterial(borde, {
      diffuseColor: Color4.fromHexString(i % 2 === 0 ? '#897762' : '#7D6A56')
    })
    // Dos vetas longitudinales sobre cada tabla.
    for (const desplazamiento of [-0.015, 0.015]) {
      const veta = engine.addEntity()
      Transform.create(veta, {
        position: {
          x: position.x + Math.sin(angulo) * (0.45 + desplazamiento),
          y: position.y + 0.081,
          z: position.z + Math.cos(angulo) * (0.45 + desplazamiento)
        },
        rotation: Quaternion.fromEulerDegrees(0, angulo * 180 / Math.PI, 0),
        scale: { x: i % 2 === 0 ? 0.11 : 0.085, y: 0.002, z: 0.004 }
      })
      MeshRenderer.setSphere(veta)
      Material.setBasicMaterial(veta, { diffuseColor: Color4.fromHexString('#604E3E') })
    }
  }

  for (const desplazamiento of [-0.2, 0, 0.2]) {
    const surco = engine.addEntity()
    Transform.create(surco, {
      position: { x: position.x + desplazamiento, y: position.y + 0.032, z: position.z },
      scale: { x: 0.016, y: 0.005, z: desplazamiento === 0 ? 0.58 : 0.46 }
    })
    MeshRenderer.setSphere(surco)
    Material.setBasicMaterial(surco, { diffuseColor: Color4.fromHexString('#574234') })
  }
}
