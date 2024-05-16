import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { UsersModule } from './modules/user/users.module';
import { LedModule } from './modules/led/led.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DataGateway } from './modules/gateway/data.gateway';
import { GroupController } from './modules/group/group.controller';
import { GroupModule } from './modules/group/group.module';

console.log(process.env.DB_URL);
@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://xuanlocok:lH0otbWNCCVTJijO@cluster0.cmpfhru.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    AuthModule,
    MqttModule,
    LedModule,
    ScheduleModule.forRoot(),
    DataGateway,
    GroupModule,
  ],
  controllers: [AppController, GroupController],
  providers: [AppService],
})
export class AppModule {}
