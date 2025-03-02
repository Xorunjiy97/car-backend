import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import { initSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(AppConfigService);
  const port = configService.port;
  const cookie = configService.cookieSecret;

  app.use(cookieParser(cookie));
  app.setGlobalPrefix(configService.globalPrefix);

  if (configService.isProd) {
    app.use(
      [
        '/' + configService.globalPrefix + '/docs',
        '/' + configService.globalPrefix + '/docs-json',
      ],
      basicAuth({
        challenge: true,
        users: { admin: configService.swaggerPassword },
      }),
    );
  }

  initSwagger(app, configService.globalPrefix, configService.nodeEnv);

  await app.listen(port);
}

bootstrap();
