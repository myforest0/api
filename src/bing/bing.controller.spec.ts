import { Test, TestingModule } from '@nestjs/testing';
import { BingController } from './bing.controller';
import { BingService } from './bing.service';

describe('BingController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [BingController],
      providers: [BingService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<BingController>(BingController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
