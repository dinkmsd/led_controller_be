import { Module, forwardRef } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { LedModule } from '../led/led.module';
import { NotificationsModule } from '..';

@Module({
  imports: [forwardRef(() => LedModule), forwardRef(() => NotificationsModule)],
  providers: [MqttService],
  controllers: [MqttController],
  exports: [MqttService],
})
export class MqttModule {}
