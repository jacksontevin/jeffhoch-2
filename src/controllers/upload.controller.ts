import Koa from 'koa';

import { saveErrorLogDB } from '../middleware/errorLog';
import UploadService from '../services/upload.service';
import { DEFAULT_STATUS_CODE_ERROR } from './../utils/config';
import { S3_GET_URL } from '../utils/config';

export const upload = async (ctx: Koa.Context, next: any) => {
  const { type, extension } = ctx.request.query;
  const uploadService = new UploadService();
  try {
    const { key, url } = await uploadService.getSignedUrlFromAWS(type, extension);
    ctx.status = 200;
    ctx.body = { key, url, S3GetURL: S3_GET_URL, imageUrl: `${S3_GET_URL}${key}` };
  } catch (err) {
    saveErrorLogDB(ctx, err.code ? err.code : DEFAULT_STATUS_CODE_ERROR , err, 'get Signed Url From AWS')
    ctx.status = err.code || 500;
    ctx.body = err;
    return;
  }
};
