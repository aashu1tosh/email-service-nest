import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
    ) { }

    async publishForgotPasswordEmail(data: any) {
        console.log("🚀 ~ ForgotPasswordService ~ publishForgotPasswordEmail ~ data:", data)
        const { to, resetToken: token } = data;
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const restorePasswordPath = this.configService.get<string>('RESTORE_PASSWORD_PATH');
        const fullPath = `${frontendUrl}${restorePasswordPath}/${token}`;
        // Construct the email content
        const subject = 'Password Reset Request';
        const html = `<p>To reset your password, please click the link below:</p>
                      <a href="${fullPath}">Reset Password</a>`;

        // Send the email using MailService
        await this.mailService.sendMail({
            to,
            subject: subject,
            html: html,
        });
    }

    async sendWebhook(data: any) {
        console.log("🚀 ~ ForgotPasswordService ~ sendWebhook ~ data:", data);

        try {
            const webhookUrl = data.webhookUrl;
            const response = await axios.post(webhookUrl, data);

            console.log('Webhook sent successfully:', response.status);
        } catch (error) {
            console.error('Error sending webhook:', error.message);
        }
    }
}
