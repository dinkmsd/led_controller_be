import { Module, forwardRef } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationFirebase,
  NotificationFirebaseSchema,
} from '@entities/index';
import { LedModule, MqttModule, UsersModule } from '..';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationFirebase.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
    UsersModule,
    forwardRef(() => LedModule),
    forwardRef(() => MqttModule),
  ],
  controllers: [NotificationsController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
