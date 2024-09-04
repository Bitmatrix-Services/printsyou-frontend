import axios, {AxiosError} from 'axios';
import {ApiResponse, commonHeaders, IClientApi} from '@utils/api/axios-utils';

export async function ClientApi<Response>({
  apiUrl,
  headers,
  method = 'GET',
  body,
  formData,
  queryParams,
  onUploadProgress,
  cancelToken,
  apiRoute,
  responseShowConfig
}: IClientApi): Promise<Response | undefined> {
  const finalResponseShowConfig: IClientApi['responseShowConfig'] = {
    success: 'Success',
    showSuccess: true,
    showError: true,
    ...(responseShowConfig ?? {})
  };
  const isClientSide = typeof window !== undefined;

  try {
    const finalApiUrl = apiRoute ?? '/api';

    let requestHeaders = headers || {};
    requestHeaders = {...requestHeaders, ...commonHeaders};

    let params = queryParams || {};
    params = {...params, apiUrl};

    const apiData = await axios.request<ApiResponse<Response>>({
      method,
      data: body || formData,
      headers: requestHeaders,
      params: params,
      onUploadProgress,
      cancelToken,
      url: finalApiUrl
    });
    if (apiData.status >= 200 && apiData.status <= 299) {
      if (finalResponseShowConfig.showSuccess && isClientSide) {
        // toast.success(finalResponseShowConfig.success!!);
      }
      return apiData.data.payload;
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof AxiosError && error.response) {
      if (finalResponseShowConfig.showError && isClientSide) {
        // toast.error(error.response.data.message);
      }
    }
    throw error;
  }

  return undefined;
}
