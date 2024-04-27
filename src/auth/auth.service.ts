import { Injectable, NotAcceptableException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/modules/user/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUserDetail(username);
    const passwordValid = await compare(password, user.password);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    if (user && passwordValid) {
      return {
        userId: user.id,
        userName: user.username,
      };
    }

    return null;
  }
}
