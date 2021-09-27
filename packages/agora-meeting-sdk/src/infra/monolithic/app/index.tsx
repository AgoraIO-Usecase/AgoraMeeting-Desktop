import { GenAppContainer } from '@/infra/containers/app-container';
import { BizPageRouter } from '@/infra/types';
import { RoomParameters } from '../../api/declare';

const routes: BizPageRouter[] = [
  BizPageRouter.LaunchPage,
  BizPageRouter.TestHomePage,
];

type AppType = {
  roomConfig?: RoomParameters;
  basename?: string;
};

export const App = (props: AppType) => {
  const AppContainer = GenAppContainer();
  return <AppContainer routes={routes} />;
};
