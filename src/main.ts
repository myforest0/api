import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.use('/public', serveStatic(join(__dirname, '../public'), {
    maxAge: '1d',
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  }));
  await app.startAllMicroservices();
  await app.listen(999);
}
bootstrap();
