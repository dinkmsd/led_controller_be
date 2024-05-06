import { Injectable, Logger } from '@nestjs/common';
import { CreateGroupDTO } from './dtos/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/common/schemas/group';
import { Model } from 'mongoose';
import { GetDetailGroupDTO } from './dtos/get-group-list.dto';
import { Led } from 'src/common/schemas/led';
import { CreateLedGroupDTO } from './dtos/create-led-group.dto';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Led.name) private ledModel: Model<Led>,
  ) {}

  private readonly logger = new Logger(GroupService.name);

  async createGroup(data: CreateGroupDTO) {
    try {
      return await this.groupModel.create({
        groupName: data.nameGroup,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getListGroup() {
    try {
      const listGroup = await this.groupModel
        .find()
        .populate('leds', null, Led.name);
      const resBody = listGroup.map((group) => {
        const id = group._id;
        const groupName = group.groupName;
        const numLeds = group.leds.length;
        const ledActive = group.leds.filter((e) => e.status === true).length;
        return {
          id,
          groupName,
          numLeds,
          ledActive,
          ledError: 0,
        };
      });
      return resBody;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getDetailGroup(data: GetDetailGroupDTO) {
    try {
      return this.groupModel
        .findById(data.groupId)
        .populate('leds', null, Led.name);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async createLedGroup(data: CreateLedGroupDTO) {
    try {
      const { name, lat, lon, groupId } = data;

      const newLed = await this.ledModel.create({
        group: groupId,
        name: name,
        lat: lat,
        lon: lon,
        status: true,
      });

      return await this.groupModel
        .findOneAndUpdate(
          { _id: groupId },
          {
            $push: {
              leds: newLed._id,
            },
          },
          { new: true },
        )
        .populate('leds', null, Led.name);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
