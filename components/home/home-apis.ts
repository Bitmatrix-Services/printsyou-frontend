import {HomePageRoutes} from '@utils/routes/be-routes';
import axios from 'axios';
import {BannerList, Category, Faq} from '@components/home/home.types';
import {ApiResponse} from '@utils/api/axios-utils';
import {PagedData} from '@utils/util-types';
import {Product} from '@components/home/product/product.types';

export const getAllCategories = async (): Promise<ApiResponse<Category[]>> => {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${HomePageRoutes.AllCategories}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getBannersList = async (): Promise<ApiResponse<BannerList[]>> => {
  try {
    const response = await axios.get<ApiResponse<BannerList[]>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${HomePageRoutes.Banners}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductsByTag = async (tag: string): Promise<ApiResponse<PagedData<Product>>> => {
  try {
    const response = await axios.get<ApiResponse<PagedData<Product>>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/byTag?tag=${tag}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getFaqsList = async (): Promise<ApiResponse<Faq[]>> => {
  try {
    const response = await axios.get<ApiResponse<Faq[]>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${HomePageRoutes.Faqs}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
