import {ApiResponse} from '@utils/api/axios-utils';
import axios from 'axios';
import {CategoryFilters} from './filter.types';

export const getCategoryFilters = async (categoryId: string): Promise<CategoryFilters | null> => {
  try {
    const response = await axios.get<ApiResponse<CategoryFilters>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/${categoryId}/filters`
    );
    return response.data.payload;
  } catch (error) {
    console.error('Error fetching category filters:', error);
    return null;
  }
};
