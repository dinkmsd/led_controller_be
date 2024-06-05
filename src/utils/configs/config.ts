import { config } from 'dotenv';
import { ENVIRONMENTS } from '@utils/configs/data-types/enums/index';

switch (process.env.NODE_ENV) {
  case ENVIRONMENTS.DEV:
    config({ path: '.env.dev' });
    break;
  case ENVIRONMENTS.STAGING:
    config({ path: '.env.staging' });
    break;
  case ENVIRONMENTS.PROD:
    config({ path: '.env.prod' });
    break;
  default:
    config({ path: '.env' });
    break;
}

export const configs = {
  // App
  port: process.env.PORT,

  // Secret key
  jwtSecretKey: process.env.JWT_SECRET_KEY,

  // MQTT
  mqttHost: process.env.MQTT_HOST,
  mqttPort: process.env.MQTT_PORT,
  connectTimeout: process.env.CONNECT_TIMEOUT,
  mqttUser: process.env.MQTT_USER,
  mqttPassword: process.env.MQTT_PASSWORD,
  reconnectPeriod: process.env.RECONNECT_PERIOD,
  defaultTopic: process.env.DEFAULT_TOPIC,

  // Redis
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  ttl: process.env.TTL,

  // MongoDB
  mongoHost: process.env.MONGODB_URL,

  // Timezone
  timezone: process.env.GMT,
};
