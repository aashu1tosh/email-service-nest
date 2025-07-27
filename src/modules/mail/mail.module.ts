// src/mail/mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; // Or PugAdapter, EjsAdapter
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('SMTP_HOST'),
                    port: configService.get<number>('SMTP_PORT'),
                    secure: configService.get<boolean>('SMTP_SECURE'), // true for 465, false for other ports
                    auth: {
                        user: configService.get<string>('SMTP_USER'),
                        pass: configService.get<string>('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get<string>('DEFAULT_EMAIL_FROM')}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }