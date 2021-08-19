import { EventEmitter } from 'events';
// import { AgoraMediaDeviceEnum } from '@/infra/types';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { ApplianceNames } from 'agora-meeting-core';
import { BizLogger } from './biz-logger';

export type AppStorage = Storage | MemoryStorage;

export class MemoryStorage {
  constructor(private readonly _storage = new Map<string, string>()) {}

  getItem(name: string) {
    return this._storage.get(name);
  }

  setItem(name: string, value: string) {
    this._storage.set(name, value);
  }

  removeItem(name: string) {
    this._storage.delete(name);
  }

  clear() {
    this._storage.clear();
  }
}

export class CustomStorage {
  private storage: AppStorage;
  languageKey: string = 'demo_language';
  constructor() {
    this.storage = new MemoryStorage();
  }
  useSessionStorage() {
    this.storage = window.sessionStorage;
  }
  read(key: string): any {
    try {
      let json = JSON.parse(this.storage.getItem(key) as string);
      return json;
    } catch (_) {
      return this.storage.getItem(key);
    }
  }

  save(key: string, val: any) {
    this.storage.setItem(key, JSON.stringify(val));
  }

  clear() {
    this.storage.clear();
  }
}

export class PersistLocalStorage {
  private storage: AppStorage;

  languageKey: string = 'app_storage';

  constructor() {
    this.storage = window.localStorage;
  }

  saveCourseWareList(jsonStringify: string) {
    this.storage.setItem('courseWare', jsonStringify);
  }

  getCourseWareSaveList() {
    const str = this.storage.getItem('courseWare');
    if (!str) {
      return [];
    }
    try {
      return JSON.parse(str) as [];
    } catch (err) {
      return [];
    }
  }
}

export const GlobalStorage = new CustomStorage();

// export const storage = new PersistLocalStorage();

export const debounce = function (foo: any, t: number) {
  let timer: any;
  return function () {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // @ts-ignore
      foo.apply(this, arguments);
    }, t);
  };
};

// media device helper
export const getDeviceLabelFromStorage = (type: string) => {
  const mediaDeviceStorage = GlobalStorage.read('mediaDevice') || {};

  if (!['cameraLabel', 'microphoneLabel'].includes(type)) {
    return '';
  }
  return mediaDeviceStorage[type];
};

export type BytesType = number | string;

export const isElectron =
  window.isElectron || window.agoraBridge ? true : false;

export const platform =
  window.isElectron || window.agoraBridge ? 'electron' : 'web';

BizLogger.info(`CURRENT RUNTIME: ${platform}`);

export const registerWorker = (workerPath: string) => {
  const emitUpdate = () => {
    const event = document.createEvent('Event');
    event.initEvent('sw.update', true, true);
    window.dispatchEvent(event);
  };

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(workerPath)
      .then(function (reg: ServiceWorkerRegistration) {
        if (reg.waiting) {
          emitUpdate();
          return;
        }

        reg.onupdatefound = function () {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  if (navigator.serviceWorker.controller) {
                    emitUpdate();
                  }
                  break;
              }
            };
          }
        };
      })
      .catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
  }
};

export const useStorageSW = (workerPath: string = './serviceWorker.js') => {
  useEffect(() => {
    registerWorker(workerPath);
  }, [registerWorker, workerPath]);
};

export class ZoomController extends EventEmitter {
  private static readonly syncDuration: number = 200;

  private static readonly dividingRule: ReadonlyArray<number> = Object.freeze([
    0.10737418240000011,
    0.13421772800000012,
    0.16777216000000014,
    0.20971520000000016,
    0.26214400000000015,
    0.3276800000000002,
    0.4096000000000002,
    0.5120000000000001,
    0.6400000000000001,
    0.8,
    1,
    1.26,
    1.5876000000000001,
    2.000376,
    2.5204737600000002,
    3.1757969376000004,
    4.001504141376,
    5.041895218133761,
    6.352787974848539,
    8.00451284830916,
    10,
  ]);

  private tempRuleIndex?: number;
  private syncRuleIndexTimer: any = null;
  private zoomScale: number = 0;

  public constructor(zoomScale: number = 0) {
    super();
    this.zoomScale = zoomScale;
  }

  private delaySyncRuleIndex(): void {
    if (this.syncRuleIndexTimer !== null) {
      clearTimeout(this.syncRuleIndexTimer);
      this.syncRuleIndexTimer = null;
    }
    this.syncRuleIndexTimer = setTimeout(() => {
      this.syncRuleIndexTimer = null;
      this.tempRuleIndex = undefined;
    }, ZoomController.syncDuration);
  }

  private static readRuleIndexByScale(scale: number): number {
    const { dividingRule } = ZoomController;

    if (scale < dividingRule[0]) {
      return 0;
    }
    for (let i = 0; i < dividingRule.length; ++i) {
      const prePoint = dividingRule[i - 1];
      const point = dividingRule[i];
      const nextPoint = dividingRule[i + 1];

      const begin =
        prePoint === undefined
          ? Number.MIN_SAFE_INTEGER
          : (prePoint + point) / 2;
      const end =
        nextPoint === undefined
          ? Number.MAX_SAFE_INTEGER
          : (nextPoint + point) / 2;

      if (scale >= begin && scale <= end) {
        return i;
      }
    }
    return dividingRule.length - 1;
  }

  protected moveRuleIndex(deltaIndex: number, scale: number): number {
    if (this.tempRuleIndex === undefined) {
      this.tempRuleIndex = ZoomController.readRuleIndexByScale(scale);
    }
    this.tempRuleIndex += deltaIndex;

    if (this.tempRuleIndex > ZoomController.dividingRule.length - 1) {
      this.tempRuleIndex = ZoomController.dividingRule.length - 1;
    } else if (this.tempRuleIndex < 0) {
      this.tempRuleIndex = 0;
    }
    const targetScale = ZoomController.dividingRule[this.tempRuleIndex];

    this.delaySyncRuleIndex();
    return targetScale;
  }
}

export const transLineTool = {
  pen: ApplianceNames.pencil,
  square: ApplianceNames.rectangle,
  circle: ApplianceNames.ellipse,
  line: ApplianceNames.straight,
};

export const transToolBar = {
  pen: ApplianceNames.pencil,
  square: ApplianceNames.rectangle,
  circle: ApplianceNames.ellipse,
  line: ApplianceNames.straight,
  selection: ApplianceNames.selector,
  text: ApplianceNames.text,
  hand: ApplianceNames.hand,
  eraser: ApplianceNames.eraser,
  // 'color': 'color',
  //  TODO: 'laserPoint icon' need import
  laserPointer: ApplianceNames.laserPointer,
  // 'blank-page': 'new-page',
  // 'cloud': 'cloud',
  // 'follow': 'follow',
  // 'tools': 'tools'
};

export const mapToolBar: any = {
  [`${ApplianceNames.pencil}`]: 'pen',
  [`${ApplianceNames.rectangle}`]: 'square',
  [`${ApplianceNames.ellipse}`]: 'circle',
  [`${ApplianceNames.arrow}`]: 'line',
  [`${ApplianceNames.selector}`]: 'selection',
  [`${ApplianceNames.text}`]: 'text',
  [`${ApplianceNames.hand}`]: 'hand',
  [`${ApplianceNames.eraser}`]: 'eraser',
};
