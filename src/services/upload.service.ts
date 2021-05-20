import AWS from 'aws-sdk';

import { v1 as uuid } from 'uuid';

import { S3_ACCESS_KEY, S3_REGION, S3_SECRET_KEY, S3_SINGATURE_VERSION, S3_BUCKET_NAME } from '../utils/config';
export default class UploadService {
  s3: any;
  MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
  };
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
      signatureVersion: S3_SINGATURE_VERSION,
      region: S3_REGION,
    });
  }

  public async getSignedUrlFromAWS(type: any, extension:any): Promise<{ key: string; url: string } | never> {
    const key = `${type}/${uuid()}.${extension ? extension : 'jpeg'}`;
    const url = await this.s3.getSignedUrl('putObject', {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: 'image/jpeg',
    });
    return { key, url };
  }

  generateFileName(file: any): string {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = this.MIME_TYPE_MAP[file.mimetype];
    const finalizedName = `${name}${Date.now()}.${ext}`;
    return finalizedName;
  }
}
