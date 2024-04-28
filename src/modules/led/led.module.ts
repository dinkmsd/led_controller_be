import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Led, LedSchema } from 'src/common/schemas/led';
import { LedController } from './led.controller';
import { LedService } from './led.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { Schedule, ScheduleSchema } from 'src/common/schemas/schedule';
import { CronJobModule } from '../cronjob/cronjob.module';
import { DataGateway } from '../gateway/data.gateway';

@Module({
  imports: [
    forwardRef(() => MqttModule),
    MongooseModule.forFeature([{ name: Led.name, schema: LedSchema }]),
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
    CronJobModule,
  ],
  controllers: [LedController],
  providers: [LedService, DataGateway],
  exports: [LedService],
})
export class LedModule {}
