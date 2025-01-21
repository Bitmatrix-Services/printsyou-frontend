import axios, {AxiosError} from 'axios';
import {cookies} from 'next/headers';
import {ApiResponse, commonHeaders, IServerApi, openEndpoints} from '@utils/api/axios-utils';
import {logger} from '@utils/logger';
import axiosCurlirize from 'axios-curlirize';

declare module 'axios' {
  interface AxiosStatic {
    isCurlirizeInitialized?: boolean;
  }
}

export async function ServerApi<Response>({request}: IServerApi): Promise<ApiResponse<Response> | undefined> {
  const cookie = await cookies();
  const searchParams = new URL(request.url).searchParams;

  let apiUrl = searchParams.get('apiUrl')!!;
  const finalApiUrl = process.env.DOMAIN_BASE_URL + apiUrl;
  logger.info('making backend call to endpoint: %s', finalApiUrl);

  if (process.env.NODE_ENV === 'development' && !axios.isCurlirizeInitialized) {
    axiosCurlirize(axios);
    axios.isCurlirizeInitialized = true;
  }

  try {
    const headers = {...commonHeaders};
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'apiUrl') {
        queryParams[key] = value;
      }
    });

    if (openEndpoints.indexOf(apiUrl) < 0) {
      headers['Authorization'] = `Bearer ${cookie.get('accessToken')?.value}`;
    }

    const apiData = await axios.request({
      method: request.method,
      data:
        request.method.toLowerCase() === 'post' ? ((await request.json()) ?? (await request.formData())) : undefined,
      headers: headers,
      url: finalApiUrl,
      params: queryParams
    });
    logger.info('api call success with status code: %s and url: %s', apiData.status, finalApiUrl);
    if (apiData.status >= 200 && apiData.status <= 299) {
      return apiData.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const headers = error.response?.headers || {};
      logger.error(
        '[%s] error occurred in call to BE service: %s, with message: %s',
        headers['x-request-id'],
        finalApiUrl,
        error.response?.data?.message
      );
      if (error.status === 401) {
        // TODO handle refresh token logic here
      }
    }
    logger.error('throwing error back to route handler');
    throw error;
  }
}
