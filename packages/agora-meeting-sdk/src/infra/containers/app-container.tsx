import { AppRouteComponent, routesMap } from '@/infra/router';
import { HomeStore } from '@/infra/stores/app/home';
import { BizPageRouter } from '@/infra/types';
import { ToastContainer } from '../../ui-kit/capabilities/containers/toast';
import { DialogContainer } from '../../ui-kit/capabilities/containers/dialog';
import { AppStoreInitParams } from 'agora-meeting-core';
import { I18nProvider } from '~ui-kit';
import { Provider } from 'mobx-react';
import {
  HashRouter,
  MemoryRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

export interface RouteContainerProps {
  routes: BizPageRouter[];
  mainPath?: string;
  inRoom?: boolean;
}

export interface AppContainerProps extends RouteContainerProps {
  basename?: string;
  store: HomeStore;
}

export interface RoomContainerProps extends RouteContainerProps {
  basename?: string;
  store: any;
}

type AppContainerComponentProps = Omit<AppContainerProps, 'defaultStore'>;

export const RouteContainer = (props: RouteContainerProps) => {
  const routes = props.routes
    .filter((path: string) => routesMap[path])
    .reduce((acc: AppRouteComponent[], item: string) => {
      acc.push(routesMap[item]);
      return acc;
    }, []);

  return (
    <>
      <Switch>
        {routes.map((item, index) => (
          <Route key={index} path={item.path} component={item.component} />
        ))}
        {props.mainPath ? (
          <Route exact path="/">
            <Redirect to={`${props.mainPath}`} />
          </Route>
        ) : null}
      </Switch>
      {props.inRoom ? <ToastContainer /> : null}
      {props.inRoom ? <DialogContainer /> : null}
    </>
  );
};

export type RoomContainerParams = {
  params: AppStoreInitParams;
  routes: BizPageRouter[];
  mainPath: string;
};

export const RoomContainer = (props: RoomContainerParams) => {
  return (
    <I18nProvider>
      <MemoryRouter>
        <RouteContainer
          routes={props.routes}
          mainPath={props.mainPath}
          inRoom={true}
        />
      </MemoryRouter>
    </I18nProvider>
  );
};

export const AppContainer = (props: AppContainerProps) => {
  return (
    <Provider store={props.store}>
      <HashRouter>
        <RouteContainer routes={props.routes} inRoom={false} />
      </HashRouter>
    </Provider>
  );
};

type GenAppComponentProps = Pick<
  AppContainerComponentProps,
  'routes' | 'basename'
>;

export const GenAppContainer = () => {
  const appStore = new HomeStore({});

  return (props: GenAppComponentProps) => (
    <AppContainer {...props} store={appStore} />
  );
};
