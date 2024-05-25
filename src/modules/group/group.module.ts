import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from 'src/common/schemas/group';
import { Led, LedSchema } from 'src/common/schemas/led';
import {
  GroupSchedule,
  GroupScheduleSchema,
} from 'src/common/schemas/group_schedule/group-schedule.schema';
import { CronJobModule } from '../cronjob/cronjob.module';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Led.name, schema: LedSchema },
      { name: GroupSchedule.name, schema: GroupScheduleSchema },
    ]),
    CronJobModule,
    MqttModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
