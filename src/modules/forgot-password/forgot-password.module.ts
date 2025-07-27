// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { ForgotPasswordController } from './forgot-passwor.controller';


@Module({
    imports: [MailModule],
    controllers: [ForgotPasswordController],
    providers: [],
    exports: [],
})
export class ForgotPasswordModule { }