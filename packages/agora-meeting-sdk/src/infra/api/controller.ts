import { unmountComponentAtNode } from 'react-dom';
import { render } from 'react-dom';
import { ReactElement } from 'react';
import { RoomCache, AgoraEvent } from 'agora-meeting-core';
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
  // 自定义数据存放
  private _data: any = {};

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

  get isInitialized(): boolean {
    return this.state === SDKInternalStateEnum.Initialized;
  }

  get state() {
    return this._state;
  }

  acquireLock() {
    this._lock = true;
    return () => {
      this._lock = false;
    };
  }

  // 对外
  getRoom() {
    return this.room;
  }

  // 设置自定义数据
  setData(name: string, value: any) {
    this._data[name] = value;
  }

  // 获取自定义数据
  getData(name: string) {
    return this._data[name];
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
    const roomCache = this.getData('agora_meeting_room_cache') || {};
    const event =
      this.getData('agora_meeting_room_event') || AgoraEvent.LeaveInitiative;
    this.callback(event, roomCache);
    this._data = {};
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
