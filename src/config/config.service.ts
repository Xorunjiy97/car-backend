import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) { }

  get swaggerPassword(): string {
    return this.configService.get<string>('SWAGGER_PASSWORD', 'password');
  }

  get nodeEnv(): string {
    return this.configService.get<string>('ENV', 'dev');
  }

  get isDev(): boolean {
    return this.nodeEnv === 'dev';
  }

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  }
  get awsRegion(): string {
    return this.configService.getOrThrow('AWS_REGION');
  }

  get awsAccessKeyId(): string {
    return this.configService.getOrThrow('AWS_ACCESS_KEY_ID');
  }

  get awsSecretAccessKey(): string {
    return this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY');
  }

  get awsBucketName(): string {
    return this.configService.getOrThrow('AWS_BUCKET_NAME');
  }
  get globalPrefix(): string {
    return `${this.nodeEnv}/api`;
  }

  get port(): number {
    return this.configService.get('APP_PORT', 3002);
  }

  get defaultDatabaseOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.getOrThrow('POSTGRES_HOST'),
      port: this.configService.getOrThrow('POSTGRES_PORT'),
      username: this.configService.getOrThrow('POSTGRES_USER'),
      password: this.configService.getOrThrow('POSTGRES_PASSWORD'),
      database: this.configService.getOrThrow('POSTGRES_DB'),
    };
  }

  get getJwtSecretKey(): string {
    return this.configService.getOrThrow('JWT_SECRET_KEY');
  }

  get getRefreshJwtSecret(): string {
    return this.configService.getOrThrow('JWT_SECRET_KEY');
  }

  get getRefreshTokenTime(): string {
    return this.configService.get('RT_SECRET_EXPIRED_TIME_IN_DAYS', '60d');
  }

  get cookieSecret(): string {
    return this.configService.getOrThrow('COOKIE_SECRET');
  }
}
