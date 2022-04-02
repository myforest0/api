import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as serveStatic from 'serve-static';
import { join } from 'path';
import { readFileSync } from 'fs';

async function bootstrap() {
  const keyFile  = readFileSync('/www/server/panel/vhost/cert/api.resonance.fun/privkey.pem');
  const certFile = readFileSync('/www/server/panel/vhost/cert/api.resonance.fun/fullchain.pem');
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: keyFile,
      cert: certFile,
    }
  });
  app.use('/public', serveStatic(join(__dirname, '../public'), {
    maxAge: '1d',
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
  }));
  await app.startAllMicroservices();
  await app.listen(999);
}
bootstrap();
