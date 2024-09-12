import {logger} from '@utils/logger';
import {callApi} from './route-utils';

export async function GET(request: Request): Promise<Response> {
  logger.debug('GET in api/sitemap.ts, requesting resource');
  return callApi(request);
}

export async function POST(request: Request): Promise<Response> {
  logger.debug('POST in api/sitemap.ts, requesting resource');
  return callApi(request);
}

export async function PUT(request: Request): Promise<Response> {
  logger.debug('PUT in api/sitemap.ts, requesting resource');
  return callApi(request);
}

export async function DELETE(request: Request): Promise<Response> {
  logger.debug('DELETE in api/sitemap.ts, requesting resource');
  return callApi(request);
}
