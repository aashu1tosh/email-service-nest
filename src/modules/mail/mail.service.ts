import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface ISendMailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASSWORD'),
            },
        });
    }

    async sendMail(data: ISendMailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: data.from || this.configService.get<string>('DEFAULT_EMAIL_FROM')!,
                to: data.to,
                subject: data.subject,
                html: data.html,
            });
            this.logger.log(`Mail sent to ${data.to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${data.to}`, error.stack);
            throw error;
        }
    }
}
