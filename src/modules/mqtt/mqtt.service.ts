import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { LedService } from '../led/led.service';
import { configs } from '@utils/configs/config';
import { NotificationService } from '@modules/notification/notification.service';

@Injectable()
export class MqttService {
  public readonly mqtt: MqttClient;
  constructor(
    @Inject(forwardRef(() => LedService))
    private ledService: LedService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
  ) {
    const logger = new Logger(MqttService.name);
    const host = configs.mqttHost;
    const port = configs.mqttPort;
    const username = configs.mqttUser;
    const password = configs.mqttPassword;
    const defaultPath = configs.defaultTopic;
    const connectUrl = `mqtt://${host}:${port}`;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.mqtt = connect(connectUrl, {
      clientId: clientId,
      clean: true,
      connectTimeout: parseInt(configs.connectTimeout, 10),
      username: username,
      password: password,
      reconnectPeriod: parseInt(configs.reconnectPeriod, 10),
    });

    this.mqtt.on('connect', () => {
      logger.log('Connected to MQTT server');
    });

    this.mqtt.subscribe(defaultPath + '/main-topic', { qos: 1 });

    this.mqtt.on('error', function () {
      logger.debug(connectUrl);

      logger.error('Error in connecting to CloudMQTT');
    });

    this.mqtt.on('message', function (topic, message) {
      logger.log('New message received!');
      logger.log(message.toString());
      const jsonData = JSON.parse(message.toString());

      if (jsonData['action'] === 'updateData') {
        logger.log('Action: Update Data');
        logger.log('Data: ');
        logger.log(jsonData);
        ledService.updateData(jsonData);
      }
      if (jsonData['action'] === 'noti') {
        logger.log('Action: Update Data');
        logger.log('Data: ');
        logger.log(jsonData);
        notificationService.setNotification(jsonData);
      }
    });
  }

  publish(topic: string, payload: string): string {
    Logger.log(`Publishing to ${topic}`);
    Logger.log('Message: ');
    Logger.log(payload);
    this.mqtt.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}
