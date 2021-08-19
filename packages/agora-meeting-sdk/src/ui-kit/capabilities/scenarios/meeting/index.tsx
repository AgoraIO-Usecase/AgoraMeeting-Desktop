import { useRoomContext } from 'agora-meeting-core';
import { useEffectOnce } from '@/infra/hooks/index';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { MeetingContainer } from '@/ui-kit/capabilities/containers/meeting';
import { LoadingContainer } from '@/ui-kit/capabilities/containers/loading';
import { useUIStore } from '@/infra/hooks';

/** 会议主界面 */
export const MettingScenario = observer(() => {
  const { join } = useRoomContext();
  const { addToast } = useUIStore();

  useEffectOnce(async () => {
    // 加入房间
    try {
      await join();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  });

  return (
    <div>
      <MeetingContainer></MeetingContainer>
      <LoadingContainer />
    </div>
  );
});
