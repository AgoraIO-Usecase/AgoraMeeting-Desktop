import { Colors, t } from '~ui-kit'
import { observer } from 'mobx-react'
import { useBoardContext } from 'agora-meeting-core'

export const ColorsContainer = observer(() => {

  const {
    changeStroke,
    changeStrokeColor,
    setAppliance,
    currentColor,
    currentStrokeWidth
  } = useBoardContext()

  return (
    <Colors
      value='color'
      label={t('scaffold.color')}
      icon='color'
      colorSliderMin={1}
      colorSliderMax={31}
      colorSliderDefault={currentStrokeWidth}
      colorSliderStep={0.3}
      onSliderChange={changeStroke}
      activeColor={currentColor}
      onClick={(value: any) => {
        setAppliance('color')
        changeStrokeColor(value)
      }}
    />
  )
})