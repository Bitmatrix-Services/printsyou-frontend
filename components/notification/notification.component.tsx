'use client';
import React, {FC, useState} from 'react';
import {useEffectOnce} from '../../hooks/use-effect-once.hook';
import {sortSortable} from '@utils/constants';
import {Notification} from '@utils/util-types';
import {getAllNotifications} from '@components/notification/notification-apis';

export const NotificationComponent: FC = ({}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffectOnce(() => {
    (async () => {
      const notis = await getAllNotifications();
      setNotifications(sortSortable(notis));
    })();
  });

  return notifications.map(notification => (
    <div
      key={notification.id}
      className="w-full flex justify-center items-center"
      style={{
        backgroundColor: notification.backgroundColor,
        minHeight: '30px',
        maxHeight: 'fit-content',
        padding: '0.3rem'
      }}
    >
      <span dangerouslySetInnerHTML={{__html: notification.notificationMessage}} />
    </div>
  ));
};
