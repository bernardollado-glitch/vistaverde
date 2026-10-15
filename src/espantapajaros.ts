import { engine, Transform, MeshRenderer, Material } from '@dcl/sdk/ecs'
import { Color4, Quaternion } from '@dcl/sdk/math'

export function crearEspantapajaros() {
  const raiz = engine.addEntity()
  Transform.create(raiz, { position: { x: 8.5, y: 0, z: 10 } })

  // Formas suaves sin colisiones: decoración al fondo que no bloquea al jugador.
  function pieza(
    forma: 'esfera' | 'cilindro' | 'caja',
    x: number, y: number, z: number,
    ancho: number, alto: number, fondo: number,
    color: string, giro = 0
  ) {
    const entidad = engine.addEntity()
    Transform.create(entidad, {
      parent: raiz,
      position: { x, y, z },
      scale: { x: ancho, y: alto, z: fondo },
      rotation: Quaternion.fromEulerDegrees(0, 0, giro)
    })
    if (forma === 'esfera') MeshRenderer.setSphere(entidad)
    else if (forma === 'cilindro') MeshRenderer.setCylinder(entidad, 0.5, 0.5)
    else MeshRenderer.setBox(entidad)
    Material.setBasicMaterial(entidad, { diffuseColor: Color4.fromHexString(color) })
    return entidad
  }

  // Poste y travesaño de madera.
  pieza('cilindro', 0, 0.95, 0.06, 0.1, 1.9, 0.1, '#775338')
  pieza('cilindro', 0, 1.37, 0.04, 0.08, 1.65, 0.08, '#775338', 90)

  // Camisa azul y mangas blandas en una pose abierta.
  pieza('esfera', 0, 1.24, 0, 0.57, 0.64, 0.32, '#5B91B5')
  for (const lado of [-1, 1]) {
    pieza('esfera', lado * 0.43, 1.36, 0, 0.65, 0.22, 0.25, '#6AA6C5', lado * 10)
    pieza('cilindro', lado * 0.71, 1.41, 0, 0.23, 0.07, 0.25, '#41677F', 90)
    for (let i = 0; i < 3; i++) {
      pieza('cilindro', lado * (0.83 + i * 0.015), 1.4 + (i - 1) * 0.045, 0,
        0.022, 0.24, 0.022, '#D6BC79', 90 + lado * (i - 1) * 12)
    }
  }

  // Remiendo, botones y pañuelo coral.
  pieza('caja', 0.14, 1.12, -0.16, 0.12, 0.13, 0.015, '#E3C286', -12)
  for (const y of [1.14, 1.3, 1.43]) pieza('esfera', -0.04, y, -0.165, 0.035, 0.035, 0.018, '#F6DEAB')
  pieza('esfera', 0, 1.57, 0, 0.3, 0.12, 0.3, '#CE6F54')
  pieza('esfera', 0.12, 1.46, -0.16, 0.13, 0.23, 0.045, '#CE6F54', -20)

  // Cabeza de tela, sombrero de paja y cinta.
  pieza('esfera', 0, 1.79, 0, 0.4, 0.43, 0.35, '#EBD8AC')
  pieza('cilindro', 0, 1.99, 0, 0.73, 0.07, 0.6, '#D6B36B')
  pieza('esfera', 0, 2.09, 0, 0.43, 0.32, 0.4, '#E3C582')
  pieza('cilindro', 0, 2.02, 0, 0.43, 0.075, 0.4, '#946D48')

  // Cara orientada hacia los cultivos (dirección -Z).
  for (const x of [-0.075, 0.075]) pieza('esfera', x, 1.82, -0.169, 0.035, 0.045, 0.018, '#453B33')
  pieza('esfera', 0, 1.76, -0.181, 0.065, 0.065, 0.05, '#C77E58')
  for (let i = -2; i <= 2; i++) {
    pieza('esfera', i * 0.027, 1.68 + Math.abs(i) * 0.009, -0.157,
      0.024, 0.013, 0.016, '#6C503D')
  }
}
