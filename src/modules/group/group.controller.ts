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
import { GroupService } from './group.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateGroupDTO } from './dtos/create-group.dto';
import { GetDetailGroupDTO } from './dtos/get-group-list.dto';
import { CreateLedGroupDTO } from './dtos/create-led-group.dto';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { CreateGroupScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateStatusDTO } from './dtos/update-status.dto';
import { GroupUpdateScheduleDTO } from './dtos/group-update-schedule.dto';
import { GroupDeleteScheduleDTO } from './dtos/group-delete-schedule.dto';

@BaseControllerDecorators({
  tag: 'group',
  apiBearerAuth: false,
  useAuthGuard: false,
})
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Create successed!',
  })
  @ApiOperation({ summary: 'Create new group records' })
  @Post('/create')
  creatGroup(@Body() data: CreateGroupDTO) {
    return this.groupService.createGroup(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get list group successed!',
  })
  @ApiOperation({ summary: 'Get list group records' })
  @Get('/list-group')
  getListGroup() {
    return this.groupService.getListGroup();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get detail group successed!',
  })
  @ApiOperation({ summary: 'Get detail group records' })
  @Post('/detail-group')
  getDetailGroup(@Body() data: GetDetailGroupDTO) {
    return this.groupService.getDetailGroup(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Create new led successed!',
  })
  @ApiOperation({ summary: 'Create new led to group records' })
  @Post('/create-led')
  createLed(@Body() data: CreateLedGroupDTO) {
    return this.groupService.createLedGroup(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Create new schedule successed!',
  })
  @ApiOperation({ summary: 'Create new led to group records' })
  @Post('/create-schedule')
  createSchedule(@Body() data: CreateGroupScheduleDTO) {
    return this.groupService.createSchedule(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Update group status successed!',
  })
  @ApiOperation({ summary: 'Update group status' })
  @Post('/update-status')
  updateStatus(@Body() data: UpdateStatusDTO) {
    return this.groupService.updateStatus(data);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/schedule/:id')
  getScheduleList(@Param('id') id: string) {
    return this.groupService.getScheduleList(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('/schedule')
  updateSchedule(@Body() data: GroupUpdateScheduleDTO) {
    return this.groupService.updateSchedule(data);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/schedule')
  deleteSchedule(@Body() data: GroupDeleteScheduleDTO) {
    return this.groupService.deleteSchedule(data);
  }
}
