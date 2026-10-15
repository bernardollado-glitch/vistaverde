/** @jsx ReactEcs.createElement */
import ReactEcs, { ReactEcsRenderer, UiEntity, ScreenInsetArea } from '@dcl/sdk/react-ecs'
import { EstadoGuardado } from './ui/EstadoGuardado'

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(() => (
    <UiEntity uiTransform={{ width: '100%', height: '100%' }}>
      <ScreenInsetArea>
        <EstadoGuardado />
      </ScreenInsetArea>
    </UiEntity>
  ))
}
