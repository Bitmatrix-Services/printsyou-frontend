import {logger} from '@utils/logger';
import {revalidatePath} from 'next/cache';

export async function GET(request: Request): Promise<Response> {
  logger.debug('POST revalidate homepage');
  if (request.headers.get('X-API-KEY') === process.env.API_KEY_SECRET) {
    logger.info('api key matched, going to revalidate the path');
    revalidatePath('/');
    return new Response('true', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      status: 200
    });
  }
  logger.error('api key not matched');
  return new Response('false', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    status: 400
  });
}
