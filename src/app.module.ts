import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { IpWhitelistGuard } from './common/guard/ip-whitelist.guard';
import { envValidation } from './config/env.validation';
import { PingController } from './modules/ping/ping.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidation
    }),
  ],
  controllers: [PingController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IpWhitelistGuard,
    }
  ],
})
export class AppModule { }
