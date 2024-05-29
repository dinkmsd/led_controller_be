import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateGroupDTO } from './dtos/create-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/common/schemas/group';
import { Model } from 'mongoose';
import { GetDetailGroupDTO } from './dtos/get-group-list.dto';
import { Led } from 'src/common/schemas/led';
import { CreateLedGroupDTO } from './dtos/create-led-group.dto';
import { Schedule } from 'src/common/schemas/schedule';
import { History } from 'src/common/schemas/history';
import CronJobService from '../cronjob/cronjob.service';
import { MqttService } from '../mqtt/mqtt.service';
import { CreateGroupScheduleDTO } from './dtos/create-schedule.dto';
import { GroupSchedule } from 'src/common/schemas/group_schedule/group-schedule.schema';
import { UpdateStatusDTO } from './dtos/update-status.dto';
import { isNil } from 'lodash';
import { GroupUpdateScheduleDTO } from './dtos/group-update-schedule.dto';
import { GroupDeleteScheduleDTO } from './dtos/group-delete-schedule.dto';
import { DeleteGroupDTO } from './dtos/delete-group.dto';
import { ConfigService } from '@nestjs/config';
const timezone = parseInt(process.env.GMT);

@Injectable()
export class GroupService implements OnModuleInit {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Led.name) private ledModel: Model<Led>,
    @InjectModel(GroupSchedule.name)
    private scheduleModel: Model<GroupSchedule>,
    private cronjobService: CronJobService,
    private mqttClient: MqttService,
    private configService: ConfigService,
  ) {}

  private readonly logger = new Logger(GroupService.name);

  async onModuleInit() {
    await this._initGroupSchedule();
    // throw new Error('Method not implemented.');
  }

  private convertTime(timeString: string) {
    const s = timeString.split(' ');
    const hhmm = s[0].split(':');
    switch (s[1]) {
      case 'AM':
        const hh = (parseInt(hhmm[0]) - timezone + 24) % 24;
        return { hour: hh, min: parseInt(hhmm[1]) };
      case 'PM': {
        let hh = parseInt(hhmm[0]);
        hh += 12;
        if (hh == 24) hh = 0;
        hh = (hh - timezone + 24) % 24;
        return { hour: hh, min: parseInt(hhmm[1]) };
      }
    }
  }

  async getListDataWithSchedule() {
    try {
      const result = await this.groupModel
        .find({})
        .populate('schedules', null, Schedule.name);
      this.logger.log('[getListDataWithSchedule] successed!');
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async _initGroupSchedule() {
    const records = await this.getListDataWithSchedule();
    records.forEach((record) => {
      record.schedules.forEach(async (schedule) => {
        if (schedule.status) {
          const name = schedule['_id'].toString();
          const getTime = this.convertTime(schedule['time']);
          const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
          this.cronjobService.addCronjob(
            name,
            timeExpression,
            this._scheduleProcess.bind(
              this,
              record._id.toString(),
              schedule.value,
            ),
          );
        }
      });
    });
  }

  private async _scheduleProcess(groupId: string, value: number) {
    this.logger.log(`Modify group: ${groupId}`);
    const mqttData = {
      lumi: value,
    };
    try {
      const defaultPath = this.configService.get<string>('DEFAULT_TOPIC');

      this.mqttClient.publish(
        defaultPath + '/group/' + groupId,
        JSON.stringify(mqttData),
      );
      this.logger.log('Update lumi successed!');
    } catch (err) {
      this.logger.error(err);
    }
  }

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

  async deleteGroup(data: DeleteGroupDTO) {
    try {
      const group = await this.groupModel
        .findOneAndDelete({ _id: data.groupId }, { new: true })
        .populate({
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
      return group;
    } catch (error) {}
  }

  async createSchedule(data: CreateGroupScheduleDTO) {
    const { groupId, time, value } = data;

    try {
      const schedule = await this.scheduleModel.create({
        group: groupId,
        time: time,
        value: value,
      });
      const result = await this.groupModel
        .findOneAndUpdate(
          { _id: groupId },
          {
            $push: {
              schedules: schedule._id,
            },
          },
          { new: true },
        )
        .populate('schedules', null, GroupSchedule.name);
      this.logger.log('[createSchedule] successed!');
      const getTime = this.convertTime(schedule['time']);
      const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
      this.logger.debug(`[timeExpression] ${timeExpression}`);
      this.cronjobService.addCronjob(
        schedule._id.toString(),
        timeExpression,
        this._scheduleProcess.bind(this, groupId, schedule.value),
      );
      return {
        message: 'Create schedule successed!',
        data: result.schedules,
      };
    } catch (e) {
      console.log(e);
      this.logger.error(e);
    }
  }

  async updateStatus(data: UpdateStatusDTO) {
    try {
      const result = await this.groupModel
        .findOneAndUpdate(
          { _id: data.groupId },
          { $set: { status: data.status } },
          {
            new: true,
          },
        )
        .populate('schedules', null, GroupSchedule.name);
      if (result.status) {
        result.schedules.map((sche) => {
          if (sche.status) {
            const name = sche['_id'].toString();
            const getTime = this.convertTime(sche['time']);
            const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
            this.cronjobService.addCronjob(
              name,
              timeExpression,
              this._scheduleProcess.bind(
                this,
                result._id.toString(),
                sche.value,
              ),
            );
          }
        });
      } else {
        result.schedules.map((sche) => {
          this.cronjobService.safeDeleteCronjob(sche['_id'].toString());
        });
      }

      this.logger.log('Update group status successed!');
      return result;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async getScheduleList(id: string) {
    try {
      const result = await this.groupModel
        .findById(id)
        .populate('schedules', null, GroupSchedule.name);
      this.logger.log('Get schedule list successed!');
      return {
        message: 'Get list schedule successed!',
        data: result.schedules,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async updateSchedule(data: GroupUpdateScheduleDTO) {
    const { scheId, groupId, value, time, status } = data;
    const dataUpdate = {};
    if (!isNil(value)) {
      dataUpdate['value'] = value;
    }
    if (!isNil(time)) {
      dataUpdate['time'] = time;
    }
    if (!isNil(status)) {
      dataUpdate['status'] = status;
    }
    try {
      const result = await this.scheduleModel.findOneAndUpdate(
        {
          _id: scheId,
        },
        {
          $set: dataUpdate,
        },
        {
          new: true,
        },
      );
      this.logger.log('Update schedule successed!');

      if (result.status) {
        this.cronjobService.safeDeleteCronjob(scheId);
        const getTime = this.convertTime(result['time']);
        const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
        this.cronjobService.addCronjob(
          scheId,
          timeExpression,
          this._scheduleProcess.bind(this, groupId, result.value),
        );
      }

      if (!result.status && !isNil(status)) {
        this.cronjobService.safeDeleteCronjob(scheId);
      }

      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async deleteSchedule(data: GroupDeleteScheduleDTO) {
    try {
      const { groupId, scheduleId } = data;

      await this.scheduleModel.findByIdAndDelete(scheduleId);
      const result = await this.groupModel
        .findOneAndUpdate(
          { _id: groupId },
          { $pull: { schedules: scheduleId } },
          {
            new: true,
          },
        )
        .populate('schedules', null, GroupSchedule.name);
      this.logger.log('Delete schedule successed!');
      this.cronjobService.safeDeleteCronjob(scheduleId);
      return {
        message: 'Delete schedule successed!',
        data: result.schedules,
      };
    } catch (err) {
      this.logger.error(err);
    }
  }
}
