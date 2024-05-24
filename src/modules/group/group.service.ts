import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateGroupDTO } from './dtos/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/common/schemas/group';
import { Model } from 'mongoose';
import { GetDetailGroupDTO } from './dtos/get-group-list.dto';
import { Led } from 'src/common/schemas/led';
import { CreateLedGroupDTO } from './dtos/create-led-group.dto';
import { Schedule } from 'src/common/schemas/schedule';
import { History } from 'src/common/schemas/history';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Led.name) private ledModel: Model<Led>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly logger = new Logger(GroupService.name);

  async createGroup(data: CreateGroupDTO) {
    try {
      const group = await this.groupModel.create({
        groupName: data.nameGroup,
      });

      const id = group._id;
      const groupName = group.groupName;
      const numLeds = group.leds.length;
      const ledActive = group.leds.filter((e) => e.status === true).length;
      const status = group.status;
      const result = {
        id,
        numLeds,
        ledActive,
        ledError: 0,
        groupName,
        leds: group.leds,
        status,
      };
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getListGroup() {
    try {
      const listGroup = await this.groupModel.find().populate({
        path: 'leds',
        populate: [
          {
            path: 'schedules',
            model: Schedule.name,
          },
          {
            path: 'histories',
            model: History.name,
          },
        ],
        model: Led.name,
      });
      const resBody = listGroup.map((group) => {
        const id = group._id;
        const groupName = group.groupName;
        const numLeds = group.leds.length;
        const ledActive = group.leds.filter((e) => e.status === true).length;
        const status = group.status;
        return {
          id,
          numLeds,
          ledActive,
          ledError: 0,
          groupName,
          leds: group.leds,
          status,
        };
      });

      console.log(resBody);

      return resBody;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getDetailGroup(data: GetDetailGroupDTO) {
    try {
      const detailGroup = await this.groupModel
        .findById({ _id: data.groupId })
        .populate({
          path: 'leds',
          select: '-histories -schedules',
          model: Led.name,
        });
      const groupName = detailGroup.groupName;
      const numLeds = detailGroup.leds.length;
      const ledActive = detailGroup.leds.filter(
        (e) => e.status === true,
      ).length;
      console.log(detailGroup);
      return {
        id: detailGroup.id,
        status: detailGroup.status,
        leds: detailGroup.leds,
        histories: [],
        schedules: [],
        groupName,
        numLeds,
        ledActive,
        ledError: 0,
      };
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

      await this.groupModel
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
      return newLed;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
