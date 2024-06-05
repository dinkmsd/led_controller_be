import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { BaseControllerDecorators } from 'src/decorators/controller.decorator';
import { AuthService } from './auth.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDTO } from './dtos/login.dto';
import { RegisterDTO } from './dtos/register.dto';
import { Public } from '@utils/decorator/public.decorator';

@BaseControllerDecorators({ tag: 'Dashboard login' })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @BaseControllerDecorators({
    tag: 'Auth token',
    apiBearerAuth: true,
    useAuthGuard: true,
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Auth successed!',
  })
  @Public()
  @Post('token')
  authToken(@Request() body: any) {
    return body.user;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login successed!',
    type: Number,
  })
  @ApiOperation({ summary: 'Login user' })
  @Public()
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
  @Public()
  @Post('register')
  register(@Body() data: RegisterDTO) {
    return this.authService.register(data);
  }
}
