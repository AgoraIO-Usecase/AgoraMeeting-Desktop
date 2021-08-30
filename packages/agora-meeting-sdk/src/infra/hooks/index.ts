import { HomeStore } from '@/infra/stores/app/home';
import { MobXProviderContext } from 'mobx-react';
import { createContext, useContext, useEffect } from 'react';
import { UIStore } from '@/infra/stores/app/ui';


export const useHomeStore = (): HomeStore => {
  const context = useContext<HomeContext>(MobXProviderContext);
  return context.store;
};

export type HomeContext = Record<string, HomeStore>;

export const UIContext = createContext<UIStore>((null as unknown) as UIStore);
export const useUIStore = () => useContext(UIContext);
