import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CreateGroupDTO } from './dtos/create-group.dto';
import { GetDetailGroupDTO } from './dtos/get-group-list.dto';
import { CreateLedGroupDTO } from './dtos/create-led-group.dto';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';

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
  @Post('/list-group')
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
}
