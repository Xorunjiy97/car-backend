import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import { initSwagger } from './swagger';
import * as cookieParser from 'cookie-parser';
import * as basicAuth from 'express-basic-auth';
import { join, resolve } from 'path'
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(AppConfigService);
  const port = configService.port;
  const cookie = configService.cookieSecret;


  // выводим путь для отладки
  const uploadsPath = join(process.cwd(), 'uploads')
  console.log('📂 Serving static files from:', uploadsPath)
  
  app.use('/uploads', express.static(uploadsPath))
  app.use(cookieParser(cookie));
  app.setGlobalPrefix(configService.globalPrefix);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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