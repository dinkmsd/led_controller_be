import { Module } from '@nestjs/common';
import { NotificationsController } from './notification.controller';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationFirebase,
  NotificationFirebaseSchema,
} from '@entities/index';
import { LedModule, UsersModule } from '..';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationFirebase.name,
        schema: NotificationFirebaseSchema,
      },
    ]),
    UsersModule,
    LedModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationService],
})
export class NotificationsModule {}
