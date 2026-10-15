import { DatosCultivo, interactuarCultivo, regarCultivo } from './estadoCultivo'

export const CLAVE_GRANJA = 'vistaverde:granja:v1'
export const POSICIONES = [
  { x: 6, y: 0.12, z: 4 }, { x: 8, y: 0.12, z: 6 },
  { x: 6, y: 0.12, z: 8 }, { x: 4, y: 0.12, z: 6 }
]
export type GranjaGuardada = { version: number; parcelas: DatosCultivo[] }

export function granjaVacia(): GranjaGuardada {
  return { version: 1, parcelas: POSICIONES.map(() => ({ plantada: false, sembradaEn: 0, cosechas: 0, regadaEn: 0 })) }
}

export function leerGranja(raw: unknown): GranjaGuardada {
  if (raw === null) return granjaVacia() // ausencia confirmada por Storage
  const value = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!value || value.version !== 1 || !Array.isArray(value.parcelas) || value.parcelas.length !== 4) {
    throw new Error('Formato de granja guardada inválido')
  }
  const parcelas = value.parcelas.map((p: DatosCultivo) => {
    if (!p || typeof p.plantada !== 'boolean' || !Number.isSafeInteger(p.sembradaEn) || p.sembradaEn < 0 ||
      (p.plantada && p.sembradaEn === 0) || !Number.isSafeInteger(p.cosechas) || p.cosechas < 0 || p.cosechas > 2147483647) {
      throw new Error('Datos de cantero guardado inválidos')
    }
    const regadaEn = p.regadaEn ?? 0 // Compatibilidad con las cosechas guardadas antes del riego.
    if (!Number.isSafeInteger(regadaEn) || regadaEn < 0 || (regadaEn > 0 && (!p.plantada || regadaEn < p.sembradaEn))) {
      throw new Error('Datos de riego guardados inválidos')
    }
    return { plantada: p.plantada, sembradaEn: p.sembradaEn, cosechas: p.cosechas, regadaEn }
  })
  return { version: 1, parcelas }
}

// Una petición describe la versión observada. Duplicados o clics simultáneos
// sobre el mismo cultivo se rechazan después de aceptar la primera acción.
export function aplicarAccion(granja: GranjaGuardada, indice: number, observado: DatosCultivo, ahora: number, accion: 'interactuar' | 'regar' = 'interactuar'): boolean {
  if (!Number.isInteger(indice) || indice < 0 || indice >= 4) return false
  const actual = granja.parcelas[indice]
  if (actual.plantada !== observado.plantada || actual.sembradaEn !== observado.sembradaEn || actual.cosechas !== observado.cosechas || (actual.regadaEn ?? 0) !== (observado.regadaEn ?? 0)) return false
  const siguiente = accion === 'regar' ? regarCultivo(actual, ahora) : interactuarCultivo(actual, ahora)
  if (!siguiente || siguiente.cosechas > 2147483647) return false
  granja.parcelas[indice] = siguiente
  return true
}

export class ColaGuardado {
  private revision = 0
  private guardada = 0
  private enCurso = false
  error = false
  get pendiente() { return this.revision !== this.guardada }
  marcarCambio() { this.revision++ }

  async guardar(granja: GranjaGuardada, escribir: (raw: string) => Promise<boolean>): Promise<void> {
    if (!this.pendiente || this.enCurso) return
    this.enCurso = true
    const revision = this.revision
    const raw = JSON.stringify(granja)
    try {
      const ok = await escribir(raw)
      this.error = !ok
      if (ok) this.guardada = revision
    } catch {
      this.error = true
    } finally {
      this.enCurso = false
    }
  }
}
