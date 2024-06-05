import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NotificationDTO } from './dtos/notification.dto';
import { Public } from '@utils/decorator/public.decorator';
@BaseControllerDecorators({
  tag: 'Notification control',
  apiBearerAuth: false,
  useAuthGuard: false,
})
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Created notification!',
  })
  @ApiOperation({ summary: 'Test notification' })
  @Public()
  @Post()
  async sendNotification(@Body() data: NotificationDTO) {
    await this.notificationService.testSendNotification(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get notification!',
  })
  @ApiOperation({ summary: 'get notification' })
  @Get()
  async getNotification() {
    return await this.notificationService.getNotification();
  }
}
