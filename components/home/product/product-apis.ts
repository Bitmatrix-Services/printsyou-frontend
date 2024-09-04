import {ApiResponse} from '@utils/api/axios-utils';
import {Product} from '@components/home/product/product.types';
import axios from 'axios';
import {ProductRoutes} from '@utils/routes/be-routes';
import {PagedData} from '@utils/util-types';

export const getProductDetailsByUniqueName = async (uniqueName: string): Promise<ApiResponse<Product> | null> => {
  try {
    const response = await axios.get<ApiResponse<Product>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByUniqueName}=${uniqueName}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
export const getProductDetailsById = async (productId: string): Promise<ApiResponse<Product> | null> => {
  try {
    const response = await axios.get<ApiResponse<Product>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductById}/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const getProductByCategoryId = async (categoryId: string): Promise<ApiResponse<PagedData<Product>>> => {
  try {
    const response = await axios.get<ApiResponse<PagedData<Product>>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByCategoryId}/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};
