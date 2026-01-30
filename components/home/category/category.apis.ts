import {ApiResponse} from '@utils/api/axios-utils';
import axios from 'axios';
import {CategoryRoutes, ProductRoutes} from '@utils/routes/be-routes';
import {Category} from '@components/home/home.types';
import {formatString} from '@utils/utils';

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

export const getAllSiblingCategories = async (parentCategoryId: string): Promise<ApiResponse<Category[]> | null> => {
  try {
    const response = await axios.get<ApiResponse<Category[]>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${CategoryRoutes.CategoriesByParentId}/${parentCategoryId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching sibling categories:', error);
    return null;
  }
};

export const getProductsLdForCategoryPage = async (id: string, page: string): Promise<ApiResponse<any> | null> => {
  try {
    const response = await axios.get<ApiResponse<Category>>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${formatString(ProductRoutes.Ld, id, page)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching product ld:', error);
    return null;
  }
};

export const getProductByCategoryWithFilers = async (
  categoryId: string,
  searchParams: any
): Promise<ApiResponse<any> | null> => {
  const {page, size, filter, maxPrice, minPrice, colors, sizes, materials, rushShipping} = searchParams;
  try {
    let query = `${process.env.NEXT_PUBLIC_API_BASE_URL}${ProductRoutes.ProductByCategoryId}/${categoryId}?page=${page ?? 1}&size=${size ?? 24}&filter=${filter ?? 'priceLowToHigh'}&minPrice=${minPrice ?? 0}&maxPrice=${maxPrice ?? 10000}`;

    // Add filter parameters
    if (colors) {
      const colorList = Array.isArray(colors) ? colors : colors.split(',');
      colorList.forEach((color: string) => {
        query += `&colors=${encodeURIComponent(color)}`;
      });
    }
    if (sizes) {
      const sizeList = Array.isArray(sizes) ? sizes : sizes.split(',');
      sizeList.forEach((s: string) => {
        query += `&sizes=${encodeURIComponent(s)}`;
      });
    }
    if (materials) {
      const materialList = Array.isArray(materials) ? materials : materials.split(',');
      materialList.forEach((material: string) => {
        query += `&materials=${encodeURIComponent(material)}`;
      });
    }
    if (rushShipping === 'true' || rushShipping === true) {
      query += `&rushShipping=true`;
    }

    const response = await axios.get(query);

    if (response.data.payload.content.length > 0) {
      return response.data.payload;
    } else return null;
  } catch (error) {
    return null;
  }
};
