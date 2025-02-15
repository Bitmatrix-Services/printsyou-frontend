'use client';
import React, { FC, useEffect, useState } from 'react';
import { Notification } from '@utils/util-types';
import { getAllNotifications } from '@components/notification/notification-apis';
import { sortSortable } from '@utils/utils';

export const NotificationComponent: FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const notis = await getAllNotifications();
                setNotifications(sortSortable(notis));
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };
        fetchNotifications();
    }, []);

    return notifications.map(({ id, backgroundColor, notificationMessage }) => (
        <div
            key={id}
            className="w-full flex justify-center items-center min-h-[30px] py-1 bg-opacity-80"
            style={{ backgroundColor }}
        >
            <span dangerouslySetInnerHTML={{ __html: notificationMessage }} />
        </div>
    ));
};
