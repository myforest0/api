import { Controller, Get, Req, Res } from '@nestjs/common';
import { BingService } from './bing.service';
import { Response, Request } from 'express';
import { ResponseData } from '../model/ResponseData'

@Controller('bing')
export class BingController {
  constructor(private readonly bingService: BingService) { }

  @Get()
  getHello(): string {
    return this.bingService.getHello();
  }

  @Get('/image/today')
  async getBingImgs(): Promise<ResponseData<any>> {
    const data = await this.bingService.getBingImgs();
    return new ResponseData(data).success()
  }

  @Get('/image/rand')
  async getRandImg(@Res() res: Response): Promise<any> {
    const data = await this.bingService.getRandImg(res);
    if (!data) {
      res.json(new ResponseData(null).fail('没有图片'))
    }
  }

  @Get('/image/all')
  getFiles(@Res() res: Response, @Req() req: Request) {
    const images = this.bingService.getAllImages(req)
    if(!images) return res.json(new ResponseData(null).fail('没有图片'))
    return res.json(new ResponseData(images).success())
  }
}
