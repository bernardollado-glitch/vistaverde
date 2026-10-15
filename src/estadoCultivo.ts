export enum EstadoCultivo {
  VACIA,
  CRECIENDO,
  LISTA,
  MARCHITA
}

// Tiempos acelerados de la demo, en segundos.
export const TIEMPO_CRECIMIENTO = 10
export const TIEMPO_PARA_MARCHITAR = 15

export type DatosCultivo = {
  plantada: boolean
  sembradaEn: number
  cosechas: number
  regadaEn?: number
}

// Las transiciones temporales se calculan, no se escriben cada frame en la red.
export function estadoCultivo(datos: DatosCultivo, ahora: number): EstadoCultivo {
  if (!datos.plantada) return EstadoCultivo.VACIA
  const transcurrido = Math.max(0, (ahora - datos.sembradaEn) / 1000)
  if (transcurrido < TIEMPO_CRECIMIENTO) return EstadoCultivo.CRECIENDO
  if (transcurrido < TIEMPO_CRECIMIENTO + TIEMPO_PARA_MARCHITAR) return EstadoCultivo.LISTA
  return EstadoCultivo.MARCHITA
}

export function interactuarCultivo(datos: DatosCultivo, ahora: number): DatosCultivo | undefined {
  switch (estadoCultivo(datos, ahora)) {
    case EstadoCultivo.VACIA:
      return { ...datos, plantada: true, sembradaEn: ahora, regadaEn: 0 }
    case EstadoCultivo.LISTA:
      return { ...datos, plantada: false, regadaEn: 0, cosechas: datos.cosechas + 1 }
    case EstadoCultivo.MARCHITA:
      return { ...datos, plantada: false, regadaEn: 0 }
    default:
      return undefined
  }
}

// Primera prueba de cuidado: la humedad informa, sin alterar aún el crecimiento.
export const DURACION_HUMEDAD = 12
export function humedadRestante(datos: DatosCultivo, ahora: number): number {
  const estado = estadoCultivo(datos, ahora)
  if (estado === EstadoCultivo.VACIA || estado === EstadoCultivo.MARCHITA || !datos.regadaEn) return 0
  return Math.max(0, Math.min(DURACION_HUMEDAD, DURACION_HUMEDAD - (ahora - datos.regadaEn) / 1000))
}
export function regarCultivo(datos: DatosCultivo, ahora: number): DatosCultivo | undefined {
  const estado = estadoCultivo(datos, ahora)
  if (estado === EstadoCultivo.VACIA || estado === EstadoCultivo.MARCHITA || (datos.regadaEn ?? 0) > 0) return undefined
  return { ...datos, regadaEn: ahora }
}
