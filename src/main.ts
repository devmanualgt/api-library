import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { CORS } from './constants';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './util/error.manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.enableCors(CORS);
  app.useGlobalFilters(new CustomExceptionFilter()); // Aplicar el filtro globalmente

  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
