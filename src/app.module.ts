import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LedService } from './modules/led/led.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth/auth.service';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { UsersModule } from './modules/user/users.module';
import { LedController } from './modules/led/led.controller';
import { LedModule } from './modules/led/led.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DataGateway } from './modules/gateway/data.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0:27017/my_dbs'),
    UsersModule,
    AuthModule,
    MqttModule,
    LedModule,
    ScheduleModule.forRoot(),
    DataGateway,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
