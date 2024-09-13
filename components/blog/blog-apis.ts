import {ApiResponse} from '@utils/api/axios-utils';
import axios from 'axios';
import {BlogRoutes} from '@utils/routes/be-routes';
import {Blog} from '@components/blog/type';

export const getAllBlogs = async (): Promise<ApiResponse<Blog[]> | null> => {
  try {
    const response = await axios.get<ApiResponse<Blog[]>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${BlogRoutes.allBlogs}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
};

export const getBlogDetails = async (blogId: string): Promise<ApiResponse<Blog> | null> => {
  try {
    const response = await axios.get<ApiResponse<Blog>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${BlogRoutes.blogById}/${blogId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return null;
  }
};
