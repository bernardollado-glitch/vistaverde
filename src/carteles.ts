import { engine, Entity, Transform, MeshRenderer, Material, TextShape, Billboard, BillboardMode } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { META_COSECHAS } from './metaComunitaria'

export type Carteles = { cosechas: Entity; marchitas: Entity }

export function crearCarteles(): Carteles {
  const raiz = engine.addEntity()
  Transform.create(raiz, { position: { x: 6, y: 1.4, z: 10 } })
  Billboard.create(raiz, { billboardMode: BillboardMode.BM_Y })

  function pieza(x: number, y: number, z: number, ancho: number, alto: number, profundidad: number, color: string, redonda = false) {
    const entidad = engine.addEntity()
    Transform.create(entidad, {
      parent: raiz, position: { x, y, z }, scale: { x: ancho, y: alto, z: profundidad }
    })
    if (redonda) MeshRenderer.setSphere(entidad)
    else MeshRenderer.setBox(entidad)
    Material.setBasicMaterial(entidad, { diffuseColor: Color4.fromHexString(color) })
    return entidad
  }

  // Dos tablas de madera con extremos suaves, fuera del recorrido entre cultivos.
  pieza(0, -0.85, 0.06, 0.12, 1, 0.12, '#6F4935')
  function tabla(y: number, color: string, texto: string): Entity {
    pieza(0, y, 0, 2.05, 0.44, 0.08, '#765039')
    for (const x of [-1.025, 1.025]) pieza(x, y, 0, 0.44, 0.44, 0.08, '#765039', true)
    pieza(0, y, -0.03, 2.03, 0.35, 0.07, color)
    for (const x of [-1.025, 1.025]) pieza(x, y, -0.03, 0.35, 0.35, 0.07, color, true)
    for (const x of [-1.12, 1.12]) pieza(x, y, -0.077, 0.035, 0.035, 0.02, '#674B36', true)
    const etiqueta = engine.addEntity()
    Transform.create(etiqueta, { parent: raiz, position: { x: 0, y, z: -0.14 } })
    TextShape.create(etiqueta, {
      text: texto, fontSize: 1.2,
      textColor: Color4.fromHexString('#FFF4D9'),
      outlineColor: Color4.fromHexString('#4A3124'), outlineWidth: 0.01
    })
    return etiqueta
  }
  return {
    cosechas: tabla(0.26, '#597F4B', `Cosechas: 0/${META_COSECHAS}`),
    marchitas: tabla(-0.26, '#A17048', 'Parcelas marchitas: 0')
  }
}

export function actualizarCarteles(carteles: Carteles, cosechas: number, marchitas: number) {
  const textos: [Entity, string][] = [
    [carteles.cosechas, `Cosechas: ${cosechas}/${META_COSECHAS}`],
    [carteles.marchitas, `Parcelas marchitas: ${marchitas}`]
  ]
  for (const [entidad, texto] of textos) {
    if (TextShape.get(entidad).text !== texto) TextShape.getMutable(entidad).text = texto
  }
}
