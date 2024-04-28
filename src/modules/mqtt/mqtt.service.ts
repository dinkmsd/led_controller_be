import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';
import { LedService } from '../led/led.service';

@Injectable()
export class MqttService {
  public readonly mqtt: MqttClient;
  constructor(
    @Inject(forwardRef(() => LedService))
    private ledService: LedService,
  ) {
    const logger = new Logger(MqttService.name);
    const host = process.env.MQTT_HOST;
    const port = process.env.MQTT_PORT;
    const connectUrl = `mqtt://${host}:${port}`;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    this.mqtt = connect(connectUrl, {
      clientId: clientId,
      clean: true,
      connectTimeout: parseInt(process.env.connectTimeout, 10),
      //   username: process.env.username,
      //   password: process.env.password,
      reconnectPeriod: parseInt(process.env.reconnectPeriod, 10),
    });

    this.mqtt.on('connect', () => {
      logger.log('Connected to MQTT server');
    });

    this.mqtt.subscribe('from-device', { qos: 1 });

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
        ledService.updateData(jsonData['data']);
      }
    });
  }

  publish(topic: string, payload: string): string {
    Logger.log(`Publishing to ${topic}`);
    this.mqtt.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}
