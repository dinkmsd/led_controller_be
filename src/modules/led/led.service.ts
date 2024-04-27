import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Led } from 'src/common/schemas/led';
import { CreateLedDTO } from './dtos/create-led.dto';
import { error, info } from 'ps-logger';
import { CreateScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { isNil } from 'lodash';
import { DeleteScheduleDTO } from './dtos/delete-schedule.dto';
import { UpdateLumiDTO } from './dtos/update-lumi.dto';
import { MqttService } from '../mqtt/mqtt.service';
import { Schedule, ScheduleSchema } from 'src/common/schemas/schedule';
import CronJobService from '../cronjob/cronjob.service';

@Injectable()
export class LedService implements OnModuleInit {
  constructor(
    @InjectModel(Led.name) private ledModel: Model<Led>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    private cronjobService: CronJobService,

    private mqttClient: MqttService,
  ) {}

  onModuleInit() {
    this._initLedSchedule;
    // throw new Error('Method not implemented.');
  }

  async getListData() {
    try {
      const result = await this.ledModel.find({}, { schedule: 0, history: 0 });
      return result;
    } catch (e) {
      error(e);
    }
  }

  async getListDataWithSchedule() {
    try {
      const result = await this.ledModel.find({}, { history: 0 });
      return result;
    } catch (e) {
      error(e);
    }
  }

  async createLed(data: CreateLedDTO) {
    const { lat, lon, name } = data;
    try {
      const result = await this.ledModel.create({
        name: name,
        lat: lat,
        lon: lon,
        status: true,
      });
      return result;
    } catch (e) {
      error(e);
    }
  }

  async createSchedule(data: CreateScheduleDTO) {
    const { ledId, time, value } = data;

    try {
      const schedule = await this.scheduleModel.create({
        time: time,
        value: value,
      });
      const result = await this.ledModel
        .findOneAndUpdate(
          { _id: ledId },
          {
            $push: {
              schedules: schedule._id,
            },
          },
          { new: true },
        )
        .populate('schedules', null, Schedule.name);
      info('Create schedule successed!');
      return result;
    } catch (e) {
      console.log(e);
      error(e);
    }
  }

  async getScheduleList(id: string) {
    try {
      const result = await this.ledModel.findById(id);
      info('Get schedule list successed!');
      return result;
    } catch (e) {
      error(e);
    }
  }

  async updateSchedule(data: UpdateScheduleDTO) {
    const { scheduleId, value, time, status } = data;
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
    console.log(dataUpdate);
    try {
      const result = await this.scheduleModel.findOneAndUpdate(
        {
          _id: scheduleId,
        },
        {
          $set: dataUpdate,
        },
        {
          new: true,
        },
      );
      info('Update schedule successed!');
      return result;
    } catch (e) {
      error(e);
    }
  }

  async deleteSchedule(data: DeleteScheduleDTO) {
    try {
      const { ledId, scheduleId } = data;

      await this.scheduleModel.findByIdAndDelete(scheduleId);
      const result = await this.ledModel
        .findOneAndUpdate(
          { _id: ledId },
          { $pull: { schedules: scheduleId } },
          {
            new: true,
          },
        )
        .populate('schedules', null, Schedule.name);
      info('Delete schedule successed!');
      return result;
    } catch (err) {
      error(err);
    }
  }

  async updateLumi(data: UpdateLumiDTO) {
    const { ledId, value } = data;
    const mqttData = {
      lumi: value,
    };
    try {
      this.mqttClient.publish('monitor/' + ledId, JSON.stringify(mqttData));
      await this.ledModel.findByIdAndUpdate(
        ledId,
        {
          $set: { brightness: value },
        },
        { new: true },
      );
    } catch (err) {
      error(err);
    }
  }

  private async _initLedSchedule() {
    const timeExpression = `${12} ${10} * * *`;
    const records = await this.getListDataWithSchedule();
    records.forEach((record) => {
      record.schedules.forEach((schedule) => {});
    });
    return this.cronjobService.addCronjob(
      'report-remind',
      timeExpression,
      this._scheduleProcess.bind(this),
    );
  }

  private _scheduleProcess(abd: string) {}
}
