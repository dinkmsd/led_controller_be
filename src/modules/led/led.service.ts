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
import { error, info } from 'ps-logger';
import { CreateScheduleDTO } from './dtos/create-schedule.dto';
import { UpdateScheduleDTO } from './dtos/update-schedule.dto';
import { isNil } from 'lodash';
import { DeleteScheduleDTO } from './dtos/delete-schedule.dto';
import { UpdateLumiDTO } from './dtos/update-lumi.dto';
import { MqttService } from '../mqtt/mqtt.service';
import { Schedule } from 'src/common/schemas/schedule';
import CronJobService from '../cronjob/cronjob.service';
import { DataGateway } from '../gateway/data.gateway';

@Injectable()
export class LedService implements OnModuleInit {
  constructor(
    @InjectModel(Led.name) private ledModel: Model<Led>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
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
      const result = await this.ledModel.find({}, { schedule: 0, history: 0 });
      return result;
    } catch (e) {
      error(e);
    }
  }

  async getListDataWithSchedule() {
    try {
      const result = await this.ledModel
        .find({}, { history: 0 })
        .populate('schedules', null, Schedule.name);
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
      const getTime = schedule['time'].split(':');
      const timeExpression = `${getTime[1]} ${getTime[0]} * * *`;
      this.cronjobService.addCronjob(
        schedule._id.toString(),
        timeExpression,
        this._scheduleProcess.bind(this, ledId, schedule.value),
      );
      return result;
    } catch (e) {
      console.log(e);
      error(e);
    }
  }

  async getScheduleList(id: string) {
    try {
      const result = await this.ledModel
        .findById(id)
        .populate('schedules', null, Schedule.name);
      info('Get schedule list successed!');
      return result;
    } catch (e) {
      error(e);
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

      this.cronjobService.deleteCronjob(scheduleId);
      if (result.status) {
        const getTime = result['time'].split(':');
        const timeExpression = `${getTime[1]} ${getTime[0]} * * *`;
        this.cronjobService.addCronjob(
          scheduleId,
          timeExpression,
          this._scheduleProcess.bind(this, ledId, result.value),
        );
      }

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
      this.cronjobService.deleteCronjob(scheduleId);
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

  async updateData(inputJson: any) {
    try {
      var randomTemp = Math.floor(Math.random() * (28 - 27) + 27);
      var randomHumi = Math.floor(Math.random() * (66 - 65) + 65);
      const history = {
        temperature: inputJson['temp'] || randomTemp,
        humidity: inputJson['humi'] || randomHumi,
        brightness: inputJson['lumi'],
        dateTime: new Date(),
        incli: inputJson['incli'],
        rsrp: inputJson['rsrp'],
        cellID: inputJson['cellID'],
      };

      const data = await this.ledModel.findByIdAndUpdate(
        inputJson['id'],
        {
          $push: { history: history },
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
          },
          // history: 0
        },
        { new: true },
      );

      var message = {
        action: 'update',
        msg: 'Successed',
        data: data,
      };
      this.dataGateway.emitMessage(message);
    } catch (error) {
      error(error);
    }
  }

  private async _initLedSchedule() {
    const records = await this.getListDataWithSchedule();
    records.forEach((record) => {
      record.schedules.forEach(async (schedule) => {
        if (schedule.status) {
          const name = schedule['_id'].toString();
          const getTime = schedule['time'].split(':');
          const timeExpression = `${getTime[1]} ${getTime[0]} * * *`;
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

  private _scheduleProcess(ledId: string, value: number) {
    this.logger.log(`Modify led: ${ledId}`);
    this.updateLumi({ ledId: ledId, value: value });
  }
}
