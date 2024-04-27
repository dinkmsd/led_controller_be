import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { UsersService } from './users.service';
import { UserDetailDTO } from './dtos/user-detail.dto';

@BaseControllerDecorators({
  tag: 'User',
  apiBearerAuth: true,
  useAuthGuard: true,
})
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get successed!',
    type: Number,
  })
  @ApiOperation({ summary: 'Get user' })
  @Post('login')
  login(@Body() data: UserDetailDTO) {
    return this.usersService.getUserDetail(data.username);
  }
}
