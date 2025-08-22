import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class StorageService {
    private readonly s3Client: S3Client
    private readonly bucket: string

    constructor(private readonly appConfigService: AppConfigService) {
        this.s3Client = new S3Client({
            region: this.appConfigService.awsRegion,
            credentials: {
                accessKeyId: this.appConfigService.awsAccessKeyId,
                secretAccessKey: this.appConfigService.awsSecretAccessKey,
            },
        });
        console.log(this.appConfigService.awsBucketName)
        this.bucket = this.appConfigService.awsBucketName;
    }

    async uploadVideo(file: Express.Multer.File, folder = 'car-services/videos'): Promise<string> {
        const key = `${folder}/${Date.now()}_${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,

        });

        await this.s3Client.send(command);

        const region = this.appConfigService.awsRegion
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    }
    async uploadCarVideo(file: Express.Multer.File, folder = 'cars/videos'): Promise<string> {
        const key = `${folder}/${Date.now()}_${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const region = this.appConfigService.awsRegion;
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    }
    async uploadCarVideoLikes(file: Express.Multer.File, folder = 'cars-likes/videos'): Promise<string> {
        const key = `${folder}/${Date.now()}_${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const region = this.appConfigService.awsRegion;
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    }
    async uploadShortCarVideo(file: Express.Multer.File, folder = 'shorts-car/videos'): Promise<string> {
        const key = `${folder}/${Date.now()}_${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const region = this.appConfigService.awsRegion;
        return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
    }

}
