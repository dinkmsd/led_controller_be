import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { LedService } from '../led/led.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttService {
  public readonly mqtt: MqttClient;
  constructor(
    @Inject(forwardRef(() => LedService))
    private ledService: LedService,
    private configService: ConfigService,
  ) {
    const logger = new Logger(MqttService.name);
    const host = this.configService.get<string>('MQTT_HOST');
    const port = this.configService.get<number>('MQTT_PORT');
    const username = this.configService.get<string>('MQTT_USER');
    const password = this.configService.get<string>('MQTT_PASSWORD');
    const defaultPath = this.configService.get<string>('DEFAULT_TOPIC');
    const connectUrl = `mqtt://${host}:${port}`;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.mqtt = connect(connectUrl, {
      clientId: clientId,
      clean: true,
      connectTimeout: parseInt(process.env.connectTimeout, 10),
      username: username,
      password: password,
      reconnectPeriod: parseInt(process.env.reconnectPeriod, 10),
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
        logger.log(jsonData['data']);
        ledService.updateData(jsonData['data']);
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
