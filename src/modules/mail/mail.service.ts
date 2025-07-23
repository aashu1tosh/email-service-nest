
import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger as NestLogger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

interface ForgotPasswordData {
    email: string;
    resetToken: string;
    userName?: string;
    resetUrl?: string;
}

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: NestLogger,
    ) { }

    async sendEmail(
        to: string,
        subject: string,
        template: string,
        context: Record<string, any>,
    ): Promise<void> {
        try {
            this.logger.log(`Attempting to send email to ${to} with template ${template}`);
            await this.mailerService.sendMail({
                to: to,
                subject: subject,
                template: template,
                context: context,
            });
            this.logger.log(`Email sent successfully to ${to} with template ${template}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}. Error: ${error.message}`, error.stack);
        }
    }

    async sendForgotPasswordEmail(data: ForgotPasswordData): Promise<void> {
        try {
            this.logger.log(`Processing forgot password email for: ${data.email}`);

            const context = {
                userName: data.userName || 'User',
                resetToken: data.resetToken,
                resetUrl: data.resetUrl || `${process.env.FRONTEND_URL}/reset-password?token=${data.resetToken}`,
                // Add any other context variables your template needs
            };

            await this.sendEmail(
                data.email,
                'Password Reset Request',
                'forgot-password', // Template name
                context
            );

            this.logger.log(`Forgot password email sent successfully to: ${data.email}`);
        } catch (error) {
            this.logger.error(`Failed to send forgot password email to ${data.email}. Error: ${error.message}`, error.stack);
            throw error; // Re-throw to handle in consumer if needed
        }
    }
}


