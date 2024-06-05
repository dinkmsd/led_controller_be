import { Controller, Get } from '@nestjs/common';
import { Public } from './utils/decorator/public.decorator';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  resendOTP() {
    return {
      status: 'ok',
    };
  }
}
