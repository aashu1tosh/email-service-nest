import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageLog } from './entity/message-log.entity';

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(MessageLog)
        private readonly messageLogRepo: Repository<MessageLog>,
        // Injected RabbitMQ publisher
        private readonly client: ClientProxy
    ) { }

    async publishForgotPasswordEmail(data: any) {
        const log = this.messageLogRepo.create({
            queue: 'forgot-password.queue',
            payload: data,
            status: 'PENDING',
        });

        await this.messageLogRepo.save(log);

        try {
            await this.client.emit('forgot-password.queue', data).toPromise();

            log.status = 'SUCCESS';
        } catch (err) {
            log.status = 'FAILED';
            log.error = err?.message || 'Unknown error';
        }

        await this.messageLogRepo.save(log);

        return log;
    }
}
