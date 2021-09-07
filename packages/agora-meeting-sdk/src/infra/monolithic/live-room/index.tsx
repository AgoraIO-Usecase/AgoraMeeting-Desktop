import { RoomContainer } from '@/infra/containers/app-container'
import { useGlobalContext } from 'agora-meeting-core'
import { BizPageRouter } from '@/infra/types'
import { observer } from 'mobx-react'
import {AgoraCSSBasement} from '~ui-kit'
import './index.css'

const routes: BizPageRouter[] = [
  BizPageRouter.PretestPage,
  BizPageRouter.Setting,
  BizPageRouter.Metting
]

export const LiveRoom = observer(() => {

  const {mainPath, params} = useGlobalContext()
    
  return (
    <>
    <AgoraCSSBasement />
    <RoomContainer
      mainPath={mainPath!}
      routes={routes}
      params={params}
    />
    </>
  )
})