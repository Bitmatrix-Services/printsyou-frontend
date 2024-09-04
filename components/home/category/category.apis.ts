import {ApiResponse} from '@utils/api/axios-utils';
import axios from 'axios';
import {CategoryRoutes} from '@utils/routes/be-routes';
import {Category} from '@components/home/home.types';

export const getCategoryDetailsByUniqueName = async (uniqueName: string): Promise<ApiResponse<Category> | null> => {
  try {
    const response = await axios.get<ApiResponse<Category>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${CategoryRoutes.CategoryByUniqueName}=${uniqueName}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
};
