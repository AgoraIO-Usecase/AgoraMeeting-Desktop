import { useBoardContext } from 'agora-meeting-core';
import { observer } from 'mobx-react';
import { Pens, t } from '~components';

export type PensContainerProps = {
  onClick: (pen: string) => void
}

export const PensContainer = observer((props: PensContainerProps) => {

  const {
    lineSelector,
    boardPenIsActive,
    setAppliance,
    updatePen
  } = useBoardContext()

  const onClick = (pen: any) => {
    setAppliance(pen)
    updatePen(pen)
  }
  
  return (
    <Pens
      value='pen'
      label={t('scaffold.pencil')}
      icon='pen'
      activePen={lineSelector}
      onClick={onClick}
      isActive={boardPenIsActive}
    />
  )
})