import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const initSwagger = (
  app: INestApplication,
  globalPrefix: string,
  nodeEnv?: string,
): void => {
  const options = new DocumentBuilder()
    .setTitle(`Backend API (${nodeEnv})`)
    .setDescription('The Backend API description')
    .setVersion('1')
    .addCookieAuth()
    .addServer('http://localhost:3002')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(globalPrefix + '/docs', app, document);
};
