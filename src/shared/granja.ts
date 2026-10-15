import { engine, Schemas } from '@dcl/sdk/ecs'
import { registerMessages } from '@dcl/sdk/network'

export const GranjaCompartida = engine.defineComponent('vistaverde::granjaPersistente', {
  parcelas: Schemas.Array(Schemas.Map({ plantada: Schemas.Boolean, sembradaEn: Schemas.Int64, cosechas: Schemas.Int, regadaEn: Schemas.Int64 }))
})

export const EstadoServidor = engine.defineComponent('vistaverde::servidor', {
  heartbeat: Schemas.Int64,
  ahora: Schemas.Int64,
  lista: Schemas.Boolean,
  guardado: Schemas.String
})

export const room = registerMessages({
  interactuar: Schemas.Map({
    parcela: Schemas.Int,
    plantada: Schemas.Boolean,
    sembradaEn: Schemas.Int64,
    cosechas: Schemas.Int,
    regadaEn: Schemas.Int64
  }),
  regar: Schemas.Map({
    parcela: Schemas.Int, plantada: Schemas.Boolean,
    sembradaEn: Schemas.Int64, cosechas: Schemas.Int, regadaEn: Schemas.Int64
  })
})
