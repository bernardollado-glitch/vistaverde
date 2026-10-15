import { engine, Entity, Transform, MeshRenderer, Material, Billboard, BillboardMode } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'

export type BarraProgreso = {
  entidades: Entity[]
  centro: Entity
  extremos: [Entity, Entity]
  color?: string
}

const ANCHO = 0.9
const ALTO = 0.1

// Se crea al sembrar y se elimina al cosechar o marchitarse.
export function crearBarraProgreso(parcela: Entity): BarraProgreso {
  const { position } = Transform.get(parcela)
  const raiz = engine.addEntity()
  Transform.create(raiz, { position: { x: position.x, y: position.y + 0.65, z: position.z } })
  Billboard.create(raiz, { billboardMode: BillboardMode.BM_ALL })
  const entidades = [raiz]

  function pieza(esfera: boolean, x: number, ancho: number, alto: number, profundidad: number, color: string) {
    const entidad = engine.addEntity()
    entidades.push(entidad)
    Transform.create(entidad, {
      parent: raiz,
      position: { x, y: 0, z: 0 },
      scale: { x: ancho, y: alto, z: profundidad }
    })
    if (esfera) MeshRenderer.setSphere(entidad)
    else MeshRenderer.setBox(entidad)
    Material.setBasicMaterial(entidad, { diffuseColor: Color4.fromHexString(color) })
    return entidad
  }

  const fondo = '#28382B'
  pieza(false, 0, ANCHO - ALTO, ALTO + 0.04, 0.035, fondo)
  pieza(true, -(ANCHO - ALTO) / 2, ALTO + 0.04, ALTO + 0.04, 0.035, fondo)
  pieza(true, (ANCHO - ALTO) / 2, ALTO + 0.04, ALTO + 0.04, 0.035, fondo)

  const centro = pieza(false, 0, ANCHO - ALTO, ALTO, 0.06, '#55DD65')
  const izquierda = pieza(true, 0, ALTO, ALTO, 0.06, '#55DD65')
  const derecha = pieza(true, 0, ALTO, ALTO, 0.06, '#55DD65')
  return { entidades, centro, extremos: [izquierda, derecha] }
}

export function actualizarBarraProgreso(barra: BarraProgreso, progreso: number, lista: boolean) {
  const fraccion = Math.max(0, Math.min(1, progreso))
  const ancho = Math.max(0.001, ANCHO * fraccion)
  const diametro = Math.min(ALTO, ancho)
  const inicio = -ANCHO / 2
  const centro = Transform.getMutable(barra.centro)
  centro.position.x = inicio + ancho / 2
  centro.scale.x = Math.max(0.001, ancho - diametro)
  for (let i = 0; i < barra.extremos.length; i++) {
    const extremo = Transform.getMutable(barra.extremos[i])
    extremo.position.x = i === 0 ? inicio + diametro / 2 : inicio + ancho - diametro / 2
    extremo.scale.x = diametro
  }

  const color = lista && fraccion <= 0.25 ? '#FF5555' : lista && fraccion <= 0.5 ? '#FFD34D' : '#55DD65'
  if (barra.color !== color) {
    for (const entidad of [barra.centro, ...barra.extremos]) {
      Material.setBasicMaterial(entidad, { diffuseColor: Color4.fromHexString(color) })
    }
    barra.color = color
  }
}

export function eliminarBarraProgreso(barra: BarraProgreso) {
  for (const entidad of [...barra.entidades].reverse()) engine.removeEntity(entidad)
}
