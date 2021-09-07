import React, { FC, useEffect, useLayoutEffect } from 'react';
import { BaseProps } from '~components/interface/base-props';
import { Input } from '~components/input';
import { MemberItem } from './item';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import {
  useUsersContext,
  DeviceTypeEnum,
  useGlobalContext,
} from 'agora-meeting-core';
import { transI18n } from '~ui-kit';
import { useUIStore } from '@/infra/hooks';
import { useMemo } from 'react';
import { remove, cloneDeep, debounce } from 'lodash';
import { RoleTypeEnum } from 'agora-meeting-core';
import { useState } from 'react';

export interface MettingMemberListProps extends BaseProps {}

export const MettingMemberList: FC<MettingMemberListProps> = observer(() => {
  const { language } = useUIStore();
  const { isHost, userDetailInfoList } = useUsersContext();
  const { setMemberVisible } = useUIStore();
  const { fireDialog } = useGlobalContext();

  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState('');

  // 根据自己的排序规则
  const finUserDetailInfoList = useMemo(() => {
    let copyList = [];
    if (filter.length) {
      copyList = cloneDeep(
        userDetailInfoList.filter(
          (item) => item.userName.indexOf(filter) !== -1,
        ),
      );
    } else {
      copyList = cloneDeep(userDetailInfoList);
    }
    const meArr = remove(copyList, (item) => !!item.isMe);
    const hostArr = remove(
      copyList,
      (item) => item.userRole === RoleTypeEnum.host,
    );
    return [...meArr, ...hostArr, ...copyList];
  }, [userDetailInfoList, filter]);

  const handleClose = () => {
    setMemberVisible(false);
  };

  const closeAllDevice = (type: DeviceTypeEnum) => {
    fireDialog('close-all-device', {
      type,
    });
  };

  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setFilter(value);
  };

  return (
    <section className="metting-member">
      <section className="member__header">
        <span className="header__left">
          {transI18n('member_list')}({finUserDetailInfoList?.length})
        </span>
        <i
          className="icon icon-search"
          onClick={(e) => setShowSearch(true)}></i>
        <i className="icon icon-close" onClick={(e) => handleClose()}></i>
      </section>
      {showSearch ? (
        <section className="member__search">
          <div className="input-search">
            <Input
              style={{ height: '30px', width: '100%' }}
              value={filter}
              placeholder={transI18n('search_member')}
              suffix={
                <i className="icon icon-close" onClick={(e) => setFilter('')} />
              }
              onChange={handleSearchChange}></Input>
          </div>
          <span
            className="text"
            onClick={(e) => {
              setFilter('');
              setShowSearch(false);
            }}>
            {transI18n('cancel')}
          </span>
        </section>
      ) : null}
      <section className="member__body">
        {finUserDetailInfoList.map((item, index) => (
          <MemberItem {...item} key={item.userId}></MemberItem>
        ))}
      </section>
      {isHost ? (
        <section className="member__footer">
          <span
            className="all-mute"
            onClick={(e) => closeAllDevice(DeviceTypeEnum.mic)}>
            {transI18n('more.mute_all_mic')}
          </span>
          <span
            className="all-close-camera"
            onClick={(e) => closeAllDevice(DeviceTypeEnum.camera)}>
            {transI18n('more.mute_all_camera')}
          </span>
        </section>
      ) : null}
    </section>
  );
});
