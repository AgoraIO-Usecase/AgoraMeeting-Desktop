import { unmountComponentAtNode } from 'react-dom';
import { AgoraEvent } from './declare';
import { render } from 'react-dom';
import { ReactElement } from 'react';
import { RoomCache } from 'agora-meeting-core';
import { cloneDeep } from 'lodash';
import { GlobalStorage } from '../storage';

export enum SDKInternalStateEnum {
  Created = 'created',
  Initialized = 'initialized',
  Destroyed = 'destroyed',
}

export type EventCallableFunction = (evt: AgoraEvent, cache?: RoomCache) => any;

export abstract class RoomAbstractStore {
  constructor() {}
  destroy!: () => Promise<any>;
}

export class Room<T extends RoomAbstractStore> {
  private readonly store!: T;
  private dom!: HTMLElement;
  private readonly controller: SDKController<T>;

  constructor(context: SDKController<T>) {
    this.controller = context;
  }

  async destroy() {
    await this.controller.destroy();
  }
}

export class SDKController<T extends RoomAbstractStore> {
  private room!: Room<T>;
  private dom!: HTMLElement;
  public callback!: EventCallableFunction;
  public _storeDestroy!: CallableFunction;
  private _state: SDKInternalStateEnum = SDKInternalStateEnum.Created;

  private _lock: boolean = false;

  constructor() {
    this.room = new Room(this);
  }

  get hasCalled() {
    if (this._lock || this.isInitialized) {
      return true;
    }
    return false;
  }

  get lock(): boolean {
    return this._lock;
  }

  acquireLock() {
    this._lock = true;
    return () => {
      this._lock = false;
    };
  }

  get isInitialized(): boolean {
    return this.state === SDKInternalStateEnum.Initialized;
  }

  // 对外
  getRoom() {
    return this.room;
  }

  get state() {
    return this._state;
  }

  create(
    component: ReactElement,
    dom: HTMLElement,
    callback: EventCallableFunction,
  ) {
    this.dom = dom;
    this.callback = callback;
    render(component, this.dom);
    this._state = SDKInternalStateEnum.Initialized;
    this.callback(AgoraEvent.ready);
  }

  bindStoreDestroy(destroy: CallableFunction) {
    this._storeDestroy = destroy;
  }

  async destroy() {
    if (this._storeDestroy) {
      await this._storeDestroy();
    }
    unmountComponentAtNode(this.dom);
    this._state = SDKInternalStateEnum.Destroyed;
    const roomCache = GlobalStorage.read('agora_meeting_room_cache') || {};
    this.callback(AgoraEvent.destroyed, roomCache);
  }
}

export class MainController {
  constructor(
    public readonly appController = new SDKController(),
    public readonly replayController = new SDKController(),
    public readonly storageController = new SDKController(),
  ) {}

  getRoom() {
    return this.appController.getRoom();
  }
}

export const controller = new MainController();
