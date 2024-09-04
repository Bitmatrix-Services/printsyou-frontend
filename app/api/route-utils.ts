import {ServerApi} from '@utils/api/axios-server.service';
import {AxiosError} from 'axios';

export const callApi = async (request: Request) => {
  try {
    const response = await ServerApi({request});
    return Response.json(response);
  } catch (error) {
    console.log('error from server', error);
    if (error instanceof AxiosError && error.response) {
      return new Response(JSON.stringify(error.response.data), {
        headers: error.response.headers as Record<string, string>,
        status: error.response.status,
        statusText: error.response.statusText
      });
    }
  }

  return new Response(JSON.stringify({message: 'Internal server error'}), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    status: 500
  });
};
