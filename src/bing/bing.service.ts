import { Injectable, Res } from '@nestjs/common';
import fetch from 'node-fetch';
import { PassThrough } from 'stream';
import { Response, Request } from 'express';
import { createWriteStream, existsSync, mkdirSync, createReadStream, readdirSync } from 'fs';
import { join } from 'path';
import { parseUrl } from 'query-string'

@Injectable()
export class BingService {
  getHello(): string {
    return 'Hello World!';
  }

  async getBingImgs(): Promise<string[]> {
    const response = await fetch('https://cn.bing.com/hp/api/model');
    const data = await response.json();

    const mediaContents = data.MediaContents
    const imageURLList = []
    if (Array.isArray(mediaContents)) {
      mediaContents.forEach(item => {
        let itemUrl = item?.ImageContent?.Image?.Url || ''
        let targetUrl = ''
        if (itemUrl.startsWith('https') || itemUrl.startsWith('http')) {
          targetUrl = itemUrl
        } else {
          targetUrl = 'https://s.cn.bing.net' + itemUrl
        }
        imageURLList.push(targetUrl)
        this.saveFile(targetUrl)
      })
    }
    return imageURLList
  }

  getAllImages(req: Request) {
    const path = join(__dirname, '../../public')
    const files = this.getFiles(path)
    return files.map(url =>  `${req.protocol}://${req.hostname}/public/${url}`)
  }

  getFiles(path: string) {
    if (!existsSync(path)) return null
    const files = readdirSync(path)
    return files
  }

  async getRandImg(@Res() res: Response) {
    const path = join(__dirname, '../../public')
    const files = this.getFiles(path)
    if (!files.length) return null
    const targetFile = files[Math.floor(Math.random() * files.length)]
    const readStream = createReadStream(join(path, targetFile))
    readStream.pipe(res)
    return readStream
  }

  async getStream(imgUrl: string) {
    const passThrough = new PassThrough()
    const buffer = await (await fetch(imgUrl)).buffer();
    passThrough.end(buffer)
    return passThrough;
  }

  async saveFile(imgUrl: string) {
    const path = join(__dirname, '../../public')
    if (!existsSync(path)) {
      mkdirSync(path)
    }
    const parse = parseUrl(imgUrl)
    console.log(parse)
    const filePath = join(path, (parse?.query?.id) as string || '')
    if (existsSync(filePath)) return
    const stream = await this.getStream(imgUrl)
    let writeStream = createWriteStream(filePath);
    stream.pipe(writeStream);
    let totalLength = 0;
    stream.on('response', (response) => {
      console.log('response headers is: ', response.headers);
    });
    stream.on('data', (chunk) => {
      totalLength += chunk.length;
      console.log('recevied data size: ' + totalLength + 'KB');
    });
    writeStream.on('close', () => {
      console.log('download finished');
    });
    return stream
  }
}
