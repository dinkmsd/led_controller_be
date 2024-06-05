import { FcmTokenDto } from '@dtos/user.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/user';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async getUser(): Promise<User[]> {
    return await this.userModel.find({});
  }

  async findUser(username: string) {
    try {
      const result = await this.userModel.findOne({ username: username });

      return {
        id: result._id,
        username: result.username,
        name: result.name,
        role: result.role,
      };
    } catch (error) {
      throw error;
    }
  }

  async createUser(username: String, password: String, name: String) {
    try {
      await this.userModel.create({
        username: username,
        password: password,
        name: name,
      });
      Logger.log('Create user successed!');
      return {
        message: 'Create successed!',
        data: {
          username,
        },
      };
    } catch (error) {
      Logger.error('Create user error!');
      throw error;
    }
  }

  async getUserDetail(userName: string) {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async updateFcmToken(_id: string, dto: FcmTokenDto) {
    const { oldToken, newToken } = dto;

    const duplicateFcmToken = await this.userModel.find({
      fcmTokens: newToken,
    });
    if (duplicateFcmToken.length > 0) {
      console.log('Duplicate fcm token');
      return;
    }
    // Find the user and remove the oldToken
    let user = await this.userModel.findByIdAndUpdate(
      _id,
      { $pull: { fcmTokens: oldToken } },
      { new: true },
    );

    if (!user) {
      throw new BadRequestException(`User with ID ${_id} not found`);
    }

    // Find the user again and add the newToken
    user = await this.userModel.findByIdAndUpdate(
      _id,
      { $addToSet: { fcmTokens: newToken } },
      { new: true },
    );

    return user;
  }
}
