import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { TokenGenerator } from 'src/utils/token-generator';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(data: RegisterDTO) {
    try {
      const result = await this.usersService.createUser(
        data.username,
        data.password,
        data.name,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginDTO) {
    const user = await this.usersService.findUser(data.username);
    const token = await TokenGenerator.generate(user, 1000);
    return {
      user,
      token,
    };
  }

  async authToken() {}
}
