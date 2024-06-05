import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Led, LedSchema } from 'src/common/schemas/led';
import { LedController } from './led.controller';
import { LedService } from './led.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { Schedule, ScheduleSchema } from 'src/common/schemas/schedule';
import { CronJobModule } from '../cronjob/cronjob.module';
import { DataGateway } from '../gateway/data.gateway';
import { History, HistorySchema } from 'src/common/schemas/history';
import { NotificationsModule } from '..';

@Module({
  imports: [
    forwardRef(() => MqttModule),
    forwardRef(() => NotificationsModule),
    MongooseModule.forFeature([
      { name: Led.name, schema: LedSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: History.name, schema: HistorySchema },
    ]),
    CronJobModule,
  ],
  controllers: [LedController],
  providers: [LedService, DataGateway],
  exports: [LedService],
})
export class LedModule {}
