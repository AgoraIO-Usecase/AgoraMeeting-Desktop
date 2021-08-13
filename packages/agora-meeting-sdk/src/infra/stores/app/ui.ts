import { action, computed, observable } from 'mobx';
import { RenderLayout, FinalRnderInfo } from '@/infra/api/declare';
import { RenderInfo, RenderInfoType, RoleTypeEnum } from 'agora-meeting-core';
import { remove, once } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { UpoladLogState } from '../../api/declare';

export type DialogType = {
  id: string;
  component: any;
  props?: any;
};

export type ToastType = {
  id: string;
  desc: string;
  type?: 'success' | 'error' | 'warning';
};

// 是否第一次生成rendermap
let _firstGen = true;

const changeFirstGenflag = once(() => {
  setTimeout(() => {
    _firstGen = false;
  }, 5000);
});

let MAX_ORDER = 1000;
let MIN_ORDER = -1000;
let HOST_ORDER = 100;

export class UIStore {
  static languages: any[] = [
    {
      text: '中文',
      name: 'zh-CN',
    },
    {
      text: 'En',
      name: 'en',
    },
  ];

  // ------------------------- observable ---------------------------

  // 全局loading
  @observable
  loading: boolean = false;

  @observable
  dialogQueue: DialogType[] = [];

  @observable
  toastQueue: ToastType[] = [];

  // 是否全屏
  @observable
  fullScreen: boolean = false;

  // 是否展示成员列表
  @observable
  memberVisible: boolean = false;

  // 渲染视图
  @observable
  renderLayout = RenderLayout.tile;

  // 根据cor中的renderInfoList生成的map
  @observable
  renderMap = new Map<string, FinalRnderInfo>();

  // log 上传的状态
  @observable
  uploadLogState: UpoladLogState = UpoladLogState.init;

  // --------------------------  computed ------------------------------

  @computed
  get finalRnderInfoList() {
    // 置顶区
    const topArr: FinalRnderInfo[] = [];
    // 非置顶区
    const normalArr: FinalRnderInfo[] = [];
    // 非音视频
    const nonMediaArr: FinalRnderInfo[] = [];
    this.renderMap.forEach((item) => {
      if (item.type !== RenderInfoType.media) {
        nonMediaArr.push(item);
      } else if (item.isTop) {
        topArr.push(item);
      } else {
        normalArr.push(item);
      }
    });
    let arr = [] as FinalRnderInfo[];
    topArr.sort((a, b) => b.order - a.order);
    normalArr.sort((a, b) => b.order - a.order);
    arr = [...nonMediaArr, ...topArr, ...normalArr];
    if (this.renderLayout === RenderLayout.lecturer) {
      // 演讲者模式
      const selectedArr = remove(arr, (item) => item.isSelected);
      if (selectedArr.length) {
        arr = [...selectedArr, ...arr];
      }
    }
    console.log('gen finalRnderInfoList', arr);
    return arr;
  }
  // ----------------------- action ----------------------------------------

  @action.bound
  genRenderMap(renderInfoList: RenderInfo[] = []) {
    if (!renderInfoList.length) {
      return;
    }
    renderInfoList.forEach((item) => {
      if (!this.renderMap.has(item.id)) {
        // 新增
        let isTop = false;
        let order = 0;
        if (_firstGen) {
          // 第一次生成 从0到n
          if (item.isMe) {
            isTop = true;
            order = MAX_ORDER++;
          } else if (item.userInfo.userRole === RoleTypeEnum.host) {
            isTop = true;
            order = HOST_ORDER--;
          } else {
            order = MIN_ORDER--;
          }
        } else {
          order = MIN_ORDER--;
        }
        this.renderMap.set(item.id, {
          ...item,
          isTop,
          order,
        });
      } else {
        // 更新
        const finalRenderInfo = this.renderMap.get(item.id);
        this.renderMap.set(item.id, {
          ...finalRenderInfo,
          ...item,
        } as FinalRnderInfo);
      }
    });

    // 删除
    this.renderMap.forEach((renderItem) => {
      const index = renderInfoList.findIndex(
        (item) => renderItem.id === item.id,
      );
      if (index === -1) {
        console.log('delete 1111', renderItem);
        // 被删掉了
        this.renderMap.delete(renderItem.id);
      }
    });

    // 已生成过
    if (_firstGen) {
      changeFirstGenflag();
    }

    console.log('genRenderMap', this.renderMap);
  }

  @action.bound
  setLayout(layout: RenderLayout) {
    this.renderLayout = layout;
  }

  // 置顶
  @action.bound
  setTileTop(id: string, isTop: boolean) {
    const info = this.renderMap.get(id);
    if (!info) {
      return;
    }
    if (isTop) {
      // 置顶
      info.isTop = true;
      info.order = MAX_ORDER++;
    } else {
      // 取消置顶
      info.isTop = false;
      info.order = MIN_ORDER--;
    }
  }

  @action.bound
  setSelectedRender(id: string) {
    this.renderMap.forEach((item: FinalRnderInfo) => {
      if (item.isSelected) {
        item.isSelected = false;
      }
    });
    const info = this.renderMap.get(id);
    if (info) {
      info.isSelected = true;
    }
  }

  @action.bound
  addToast(desc: string, type?: 'success' | 'error' | 'warning') {
    const id = uuidv4();
    this.toastQueue.push({ id, desc, type });
    return id;
  }

  @action.bound
  removeToast(id: string) {
    this.toastQueue = this.toastQueue.filter((item) => item.id != id);
    return id;
  }

  @action.bound
  addDialog(component: any, props?: any) {
    const id = props && props.id ? props.id : uuidv4();
    this.dialogQueue.push({ id, component, props });
    return id;
  }

  @action.bound
  removeDialog(id: string) {
    this.dialogQueue = this.dialogQueue.filter(
      (item: DialogType) => item.id !== id,
    );
  }

  @action.bound
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  setMemberVisible(visible: boolean) {
    this.memberVisible = visible;
  }

  @action.bound
  setFullScreen(value: boolean) {
    this.fullScreen = value;
  }

  @action.bound
  setUploadLogState(value: UpoladLogState) {
    this.uploadLogState = value;
  }
}
