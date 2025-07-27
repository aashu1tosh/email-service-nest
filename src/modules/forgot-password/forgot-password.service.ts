import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ForgotPasswordService {
    constructor(
        private readonly mailService: MailService,
    ) { }

    async publishForgotPasswordEmail(data: any) {
        const { email, token } = data;

        // Construct the email content
        const subject = 'Password Reset Request';
        const html = `<p>To reset your password, please click the link below:</p>
                      <a href="https://yourapp.com/reset-password?token=${token}">Reset Password</a>`;

        // Send the email using MailService
        await this.mailService.sendMail({
            to: email,
            subject: subject,
            html: html,
        });
    }
}
