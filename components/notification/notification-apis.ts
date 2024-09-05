import {Notification} from '@utils/util-types';
import axios from 'axios';
import {NotificationRoutes} from '@utils/routes/be-routes';

export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}${NotificationRoutes.allNotifications}`);
    return res.data?.payload;
  } catch (error) {
    console.error('Error fetching product:', error);
    return [];
  }
};
