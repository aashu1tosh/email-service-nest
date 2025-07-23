import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailConsumer implements OnModuleInit {
    private readonly logger = new Logger(MailConsumer.name);
    private queueName: string;

    constructor(
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) { }

    onModuleInit() {
        this.queueName = this.configService.get<string>('forgot-password.queue')!;
    }

    @EventPattern() // no static queue name
    async handleMessage(@Payload() data: any, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();
        const originalMsg = context.getMessage();

        const routingKey = originalMsg.fields.routingKey;
        if (routingKey === this.queueName) {
            this.logger.log(`Received from [${routingKey}]: ${JSON.stringify(data)}`);
            await this.mailService.publishForgotPasswordEmail(data);
        }

        channel.ack(originalMsg);
    }
}
