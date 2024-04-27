import { error, info } from 'ps-logger';
import { Injectable } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';

@Injectable()
export class MqttService {
  public readonly mqtt: MqttClient;

  constructor() {
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
      info('Connected to MQTT server');
    });

    this.mqtt.subscribe('from-device', { qos: 1 });

    this.mqtt.on('error', function () {
      error(connectUrl);
      error('Error in connecting to CloudMQTT');
    });

    this.mqtt.on('message', function (topic, message) {
      console.log('New message received!');
      info(message.toString());
    });
  }

  publish(topic: string, payload: string): string {
    info(`Publishing to ${topic}`);
    this.mqtt.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}
