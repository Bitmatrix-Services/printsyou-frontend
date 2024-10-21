import {AxiosProgressEvent, CancelToken, Method, RawAxiosRequestHeaders} from 'axios';
import {HomePageRoutes} from '@utils/routes/be-routes';

export interface IClientApi {
  apiUrl: string;
  headers?: RawAxiosRequestHeaders;
  method?: Method;
  body?: any;
  formData?: FormData;
  queryParams?: object;
  onUploadProgress?: (_event: AxiosProgressEvent) => void;
  cancelToken?: CancelToken;
  apiRoute?: string;
  responseShowConfig?: {
    success?: string;
    showSuccess?: boolean;
    showError?: boolean;
  };
}

export interface IServerApi {
  request: Request;
}


export interface ApiResponse<T> {
  requestId: string;
  status: string;
  hasError: boolean;
  payload: T;
}

export const openEndpoints: string[] = [HomePageRoutes.AllCategories];

export const commonHeaders: RawAxiosRequestHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};
