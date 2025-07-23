import { Controller, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailConsumer {
    private readonly logger = new Logger(MailConsumer.name);

    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) { }

    // Use the routing key as the pattern
    @MessagePattern('forgot-password.queue')
    async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
        console.log("🚀 ~ MailConsumer ~ handleMessage ~ context:", context)
        console.log("🚀 ~ MailConsumer ~ handleMessage ~ data:", data)
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();


        try {
            this.logger.log(`Received message: ${JSON.stringify(data)}`);

            await this.mailService.publishForgotPasswordEmail(data);
            channel.ack(originalMsg);
            this.logger.log('Message processed successfully');
        } catch (error) {
            this.logger.error(`Error processing message: ${error.message}`);
            channel.nack(originalMsg, false, false);
        }
    }
}