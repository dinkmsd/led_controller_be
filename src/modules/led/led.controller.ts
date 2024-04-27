import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { LedService } from './led.service';
import { CreateLedDTO } from './dtos/create-led.dto';
import { CreateScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateLumiDTO } from './dtos/update-lumi.dto';
import { DeleteScheduleDTO } from './dtos/delete-schedule.dto';
import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@BaseControllerDecorators({
  tag: 'led control',
  apiBearerAuth: true,
  useAuthGuard: true,
})
@Controller('led')
export class LedController {
  constructor(private ledService: LedService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Create successed!',
  })
  @ApiOperation({ summary: 'Create new led records' })
  @Post('/data')
  createLed(@Body() data: CreateLedDTO) {
    return this.ledService.createLed(data);
  }

  @Get('/data')
  getListData() {
    return this.ledService.getListData();
  }

  @Post('/schedule')
  createSchedule(@Body() data: CreateScheduleDTO) {
    return this.ledService.createSchedule(data);
  }

  @Get('/schedule/:id')
  getScheduleList(@Param('id') id: string) {
    return this.ledService.getScheduleList(id);
  }

  @Patch('/schedule')
  updateSchedule(@Body() data: UpdateScheduleDTO) {
    return this.ledService.updateSchedule(data);
  }

  @Delete('/schedule')
  deleteSchedule(@Body() data: DeleteScheduleDTO) {
    return this.ledService.deleteSchedule(data);
  }

  @Patch('/brightness')
  updateBrightness(@Body() data: UpdateLumiDTO) {
    return this.ledService.updateLumi(data);
  }

  // @Get('/demo')
  // demo() {
  //   return this.ledService.getScheduleDemo('6624e32341a54231f2eb7fbd');
  // }
}
