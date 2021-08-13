import { BizPagePath, BizPageRouter } from '@/infra/types';
import { HomePage } from '@/infra/debug-page/home';
import { LaunchPage } from '@/infra/debug-page/launch';
import { PretestScenarioPage } from '@/ui-kit/capabilities/scenarios/pretest';
import { MettingScenario } from '@/ui-kit/capabilities/scenarios/meeting';
import * as React from 'react';

export type AppRouteComponent = {
  path: string;
  component: React.FC<any>;
};

// TODO: need fix tsx
const PageSFC = (Component: React.FC<any>) => {
  return <Component />;
};

export const routesMap: Record<string, AppRouteComponent> = {
  [BizPageRouter.Metting]: {
    path: '/metting',
    component: () => PageSFC(MettingScenario),
  },
  [BizPageRouter.LaunchPage]: {
    path: '/launch',
    component: () => PageSFC(LaunchPage),
  },
  [BizPageRouter.PretestPage]: {
    path: '/pretest',
    component: () => PageSFC(PretestScenarioPage),
  },
  [BizPageRouter.TestHomePage]: {
    path: '/',
    component: () => PageSFC(HomePage),
  },
};
