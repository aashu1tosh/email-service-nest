import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller()
export class MailConsumer {
    private readonly logger = new Logger(MailConsumer.name);

    constructor(private readonly mailService: MailService) { }

    @EventPattern('forgot-password.queue')
    async handleForgotPassword(@Payload() data: any) {
        this.logger.log(`Received: ${JSON.stringify(data)}`);
        await this.mailService.sendForgotPasswordEmail(data);
    }
}
