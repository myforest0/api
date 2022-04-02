import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BingController } from './bing/bing.controller';
import { AppService } from './app.service';
import { BingService } from './bing/bing.service';

@Module({
  imports: [],
  controllers: [AppController, BingController],
  providers: [AppService, BingService],
})
export class AppModule {}
