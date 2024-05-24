import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { UsersModule } from './modules/user/users.module';
import { LedModule } from './modules/led/led.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupController } from './modules/group/group.controller';
import { GroupModule } from './modules/group/group.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
        retryDelay: 500,
        retryAttempts: 3,
        autoIndex: true,
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MqttModule,
    LedModule,
    ScheduleModule.forRoot(),
    GroupModule,
  ],
  controllers: [AppController, GroupController],
  providers: [AppService],
})
export class AppModule {}
