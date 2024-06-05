import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as serviceAccount from '@utils/configs/firebase/push-notification.config.json';
import * as admin from 'firebase-admin';

require('dotenv/config');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Led Controller')
    .setDescription('The led control system')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  if (process.env.NODE_ENV === 'development') {
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
  }
  SwaggerModule.setup('docs', app, document);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
  const port = process.env.PORT || 8080;

  await app.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}/docs`);
  });
}
bootstrap();
