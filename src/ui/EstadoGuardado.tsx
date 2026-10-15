/** @jsx ReactEcs.createElement */
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

export interface State { mensaje: string }
export const state: State = { mensaje: 'Conectando con la granja...' }

export function EstadoGuardado(props: {}) {
  return (
    <UiEntity uiTransform={{ width: '100%', height: 52, justifyContent: 'center', padding: { top: 12 } }}>
      <UiEntity
        uiTransform={{ width: 340, height: 36, justifyContent: 'center', alignItems: 'center' }}
        uiBackground={{ color: { r: 0.12, g: 0.22, b: 0.16, a: 0.9 } }}
      >
        <Label
          value={`${state.mensaje}`}
          fontSize={16}
          color={{ r: 1, g: 0.97, b: 0.88, a: 1 }}
          textAlign="middle-center"
          uiTransform={{ width: 330, height: 32 }}
        />
      </UiEntity>
    </UiEntity>
  )
}
