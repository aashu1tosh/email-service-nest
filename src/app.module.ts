import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { IpWhitelistGuard } from './common/guard/ip-whitelist.guard';
import { PingController } from './modules/ping/ping.controller';

@Module({
  imports: [],
  controllers: [PingController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: IpWhitelistGuard,
    }
  ],
})
export class AppModule { }
