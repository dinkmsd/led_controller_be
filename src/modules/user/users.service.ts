import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findUser(username: string) {
    try {
      const result = await this.userModel.findOne({ username: username });

      return {
        id: result._id,
        username: result.username,
      };
    } catch (error) {
      throw error;
    }
  }

  async createUser(username: String, password: String) {
    try {
      await this.userModel.create({
        username: username,
        password: password,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserDetail(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }
}
