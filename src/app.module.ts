import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { GroupController } from './modules/group/group.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { configs } from '@utils/configs/config';
import { redisStore } from 'cache-manager-redis-yet';
import * as MODULES from '@modules';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from '@guards/authentication.guard';

@Module({
  imports: [
    MongooseModule.forRoot(configs.mongoHost),
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => ({
    //     store: await redisStore({
    //       password: configs.redisPassword,
    //       socket: {
    //         host: configs.redisHost,
    //         port: Number(configs.redisPort),
    //       },
    //     }),
    //   }),
    // }),
    ScheduleModule.forRoot(),
    ...Object.values(MODULES),
  ],
  controllers: [AppController, GroupController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthenticationGuard,
    // },
  ],
})
export class AppModule {}
