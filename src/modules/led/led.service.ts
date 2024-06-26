import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Led } from 'src/common/schemas/led';
import { CreateLedDTO } from './dtos/create-led.dto';
import { CreateScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { isNil } from 'lodash';
import { DeleteScheduleDTO } from './dtos/delete-schedule.dto';
import { UpdateLumiDTO } from './dtos/update-lumi.dto';
import { MqttService } from '../mqtt/mqtt.service';
import { Schedule } from 'src/common/schemas/schedule';
import CronJobService from '../cronjob/cronjob.service';
import { History } from 'src/common/schemas/history';
import { DataGateway } from '../gateway/data.gateway';
import { Group } from 'src/common/schemas/group';
import { configs } from '@utils/configs/config';
import { LedUpdateModeDTO } from './dtos/led-update-mode.dto';
require('dotenv/config');

@Injectable()
export class LedService implements OnModuleInit {
  constructor(
    @InjectModel(Led.name) private ledModel: Model<Led>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(History.name) private historyModel: Model<History>,
    private cronjobService: CronJobService,
    @Inject(forwardRef(() => MqttService))
    private mqttClient: MqttService,
    private dataGateway: DataGateway,
  ) {}

  private readonly logger = new Logger(LedService.name);

  async onModuleInit() {
    await this._initLedSchedule();
    // throw new Error('Method not implemented.');
  }

  async getListData() {
    try {
      const result = await this.ledModel.find(
        {},
        { schedules: 0, histories: 0 },
      );
      this.logger.log('Get data successed!');
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async getDetailLed() {}

  async getListDataWithSchedule() {
    try {
      const result = await this.ledModel
        .find({}, { histories: 0 })
        .populate('schedules', null, Schedule.name);
      this.logger.log('[getListDataWithSchedule] successed!');
      return result;
    } catch (e) {
      this.logger.error(e);
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
      this.logger.log('[createLed] successed!');
      return result;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private convertTime(timeString: string) {
    const s = timeString.split(' ');
    const hhmm = s[0].split(':');
    switch (s[1]) {
      case 'AM':
        const hh = (parseInt(hhmm[0]) - parseInt(configs.timezone) + 24) % 24;
        return { hour: hh, min: parseInt(hhmm[1]) };
      case 'PM': {
        let hh = parseInt(hhmm[0]);
        if (hh === 12) return { hour: hh, min: parseInt(hhmm[1]) };
        hh += 12;
        if (hh == 24) hh = 0;
        hh = (hh - parseInt(configs.timezone) + 24) % 24;
        return { hour: hh, min: parseInt(hhmm[1]) };
      }
    }
  }

  async createSchedule(data: CreateScheduleDTO) {
    const { ledId, time, value } = data;
    try {
      const schedule = await this.scheduleModel.create({
        led: ledId,
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
      this.logger.log('[createSchedule] successed!');
      const getTime = this.convertTime(schedule['time']);
      const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
      this.logger.debug(`[timeExpression] Time expression: ${timeExpression}`);
      this.cronjobService.addCronjob(
        schedule._id.toString(),
        timeExpression,
        this._scheduleProcess.bind(this, ledId, schedule.value),
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

  async getScheduleList(id: string) {
    try {
      const result = await this.ledModel
        .findById(id)
        .populate('schedules', null, Schedule.name);
      this.logger.log('Get schedule list successed!');
      return {
        message: 'Get list schedule successed!',
        data: result.schedules,
      };
    } catch (e) {
      this.logger.error(e);
    }
  }

  async updateSchedule(data: UpdateScheduleDTO) {
    const { ledId, scheduleId, value, time, status } = data;
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
          _id: scheduleId,
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
        this.cronjobService.safeDeleteCronjob(scheduleId);
        const getTime = this.convertTime(result['time']);
        const timeExpression = `${getTime.min} ${getTime.hour} * * *`;
        this.cronjobService.addCronjob(
          scheduleId,
          timeExpression,
          this._scheduleProcess.bind(this, ledId, result.value),
        );
      }

      if (!result.status && !isNil(status)) {
        this.cronjobService.safeDeleteCronjob(scheduleId);
      }

      return result;
    } catch (e) {
      this.logger.error(e);
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

  async updateLumi(data: UpdateLumiDTO) {
    const { ledId, value } = data;
    const mqttData = {
      lumi: value,
    };
    const defaultPath = configs.defaultTopic;
    try {
      this.mqttClient.publish(
        defaultPath + '/led/' + ledId,
        JSON.stringify(mqttData),
      );
      const led = await this.ledModel
        .findByIdAndUpdate(
          ledId,
          {
            $set: { brightness: value, updatedAt: new Date() },
          },
          { new: true },
        )
        .select('-schedules -histories')
        .lean();
      this.logger.log('Update lumi successed!');
      var message = {
        action: 'update',
        message: 'Successed',
        data: {
          group: led.group,
          id: led._id,
          brightness: led.brightness,
          updatedAt: led.updatedAt,
        },
      };
      this.dataGateway.emitMessage('update', message);
      return led;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async updateData(inputJson: any) {
    try {
      var randomTemp = Math.floor(Math.random() * (28 - 27) + 27);
      var randomHumi = Math.floor(Math.random() * (66 - 65) + 65);
      const history = {
        led: inputJson['id'],
        temp: inputJson['temp'] || randomTemp,
        humi: inputJson['humi'] || randomHumi,
        brightness: inputJson['lumi'],
        dateTime: new Date(),
        incli: inputJson['incli'],
        rsrp: inputJson['rsrp'],
        cellID: inputJson['cellID'],
      };

      const historyRecord = await this.historyModel.create(history);
      const data = await this.ledModel.findByIdAndUpdate(
        inputJson['id'],
        {
          // $push: { histories: historyRecord._id },
          $set: {
            status: true,
            x: inputJson['x'],
            y: inputJson['y'],
            z: inputJson['z'],
            incli: inputJson['incli'],
            rsrp: inputJson['rsrp'],
            cellID: inputJson['cellID'],
            temp: inputJson['temp'],
            humi: inputJson['humi'],
            brightness: inputJson['lumi'],
            updatedAt: new Date(),
          },
          // histories: 0
        },
        { new: true },
      );

      var message = {
        action: 'update',
        message: 'Successed',
        data,
      };
      this.dataGateway.emitMessage('update', message);
      this.logger.log('updateData successed!');
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async _initLedSchedule() {
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

  private async _scheduleProcess(ledId: string, value: number) {
    this.logger.log(`Modify led: ${ledId}`);
    const led = await this.ledModel
      .findById({ _id: ledId })
      .populate('group', null, Group.name);
    if (!led.group.status && !led.autoMode) {
      this.updateLumi({ ledId: ledId, value: value });
      this.logger.log(`Modify successed!`);
    } else {
      this.logger.error('It running group manage mode');
    }
  }

  async getById(ledId: string): Promise<Led> {
    return await this.ledModel.findById(ledId);
  }

  async updateMode(data: LedUpdateModeDTO) {
    try {
      const result = await this.ledModel
        .findOneAndUpdate(
          { _id: data.ledId },
          { $set: { autoMode: data.status } },
          {
            new: true,
          },
        )
        .populate('schedules', null, Schedule.name);
      if (result.autoMode) {
        const { ledId } = data;
        const mqttData = {
          lumi: 300,
        };
        console.log(mqttData);
        const defaultPath = configs.defaultTopic;
        this.mqttClient.publish(
          defaultPath + '/led/' + ledId,
          JSON.stringify(mqttData),
        );
      }

      this.logger.log('Update group status successed!');
      return result;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
