import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { NotificationDTO } from './dtos/notification.dto';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { NotificationFirebase } from '@entities/notification.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LedService, UsersService } from '@modules/index-service';
import { ISendNotification } from '@interfaces/notification.interface';
import { NOTIFICATION_LED_ALERT_EVENT } from '@utils/configs/data-types/enums';
import { Led } from 'src/common/schemas/led';
import { Schedule } from 'src/common/schemas/schedule';
import { History } from 'src/common/schemas/history';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationFirebase.name)
    private readonly notificationFirebaseModel: Model<NotificationFirebase>,
    private userService: UsersService,
    @Inject(forwardRef(() => LedService))
    private ledService: LedService,
  ) {}

  async sendNotification(recipient: ISendNotification) {
    const led = await this.ledService.getById(recipient.ledId);
    if (!led) return;
    await this.notificationFirebaseModel.create({
      title: recipient.title,
      led: recipient.ledId,
      event: recipient.event,
    });

    console.log(led);
    if (recipient.fcmTokens && recipient.fcmTokens.length > 0) {
      const uniqueFcmTokens = [...new Set(recipient.fcmTokens)];

      const messages = uniqueFcmTokens.map((fcmToken) => {
        const message: Message = {
          notification: {
            title: recipient.title,
            body: `Led '${led.name}' is faulty, please repair it`,
          },
          token: fcmToken,
        };
        return message;
      });
      try {
        await getMessaging().sendEach(messages);
      } catch (error) {
        console.error('Failed to send one or more notifications:', error);
        throw error;
      }
    }
  }

  async testSendNotification(data: NotificationDTO) {
    const { ledId, title } = data;
    const { fcmTokens } = await this.userService.findById(
      '66445e2bd5b42c6a61c895e1',
    );
    await this.sendNotification({
      fcmTokens,
      title,
      ledId,
      event: NOTIFICATION_LED_ALERT_EVENT.MAINTAIN,
    });
  }

  async getNotification() {
    const notifications = await this.notificationFirebaseModel
      .find({})
      .populate({
        path: 'led',
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
    console.log(notifications);
    return notifications;
  }

  async setNotification(inputJson: any) {
    const users = await this.userService.getUser();
    let fcmTokens = [];
    users.map((user) => {
      fcmTokens.push(...user.fcmTokens);
    });
    await this.sendNotification({
      fcmTokens,
      title: 'Something Error',
      ledId: inputJson['id'],
      event: NOTIFICATION_LED_ALERT_EVENT.MAINTAIN,
    });
  }
}
