import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv/config');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    // credentials: true,
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
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 80;

  await app.listen(port, () => {
    console.log(`Server is running at: localhost:${port}`);
  });
}
bootstrap();
