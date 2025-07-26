import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailConsumer implements OnModuleInit {
    private readonly logger = new Logger(MailConsumer.name);

    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) { }

    onModuleInit() {
        this.logger.log('MailConsumer initialized and ready to receive messages');
    }

    @EventPattern('forgot-password')
    async handleAllMessages(@Payload() data: { to: string; resetToken: string }) {
        console.log('🎯 Received message:', data);
        this.logger.log('Processing message from queue');

        if (data && data.to && data.resetToken) {
            // await this.processForgotPassword(data);
        } else {
            this.logger.warn('Received message with unknown format:', data);
        }
    }
}