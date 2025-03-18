import { S3Client } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import multerS3 from 'multer-s3';
import multer from 'multer';

export const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

export const multerS3Config = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileExtName = path.extname(file.originalname);
            const randomName = uuidv4();
            cb(null, `cars/${randomName}${fileExtName}`);
        },
    }),
});
