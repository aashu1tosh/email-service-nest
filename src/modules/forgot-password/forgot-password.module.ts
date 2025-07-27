// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';


@Module({
    imports: [MailModule],
    controllers: [ForgotPasswordController],
    providers: [ForgotPasswordService],
    exports: [],
})
export class ForgotPasswordModule { }