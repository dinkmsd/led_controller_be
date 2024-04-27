import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';

@BaseControllerDecorators({ tag: 'Dashboard login' })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login successed!',
    type: Number,
  })
  @ApiOperation({ summary: 'Login user' })
  @Post('login')
  login(@Body() data: LoginDTO) {
    return this.authService.login(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Register successed!',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password',
  })
  @Post('register')
  register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }
}
