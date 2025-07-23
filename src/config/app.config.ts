import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { AppModule } from 'src/app.module';
import { winstonLoggerOptions } from 'src/logger/winston.logger';

export async function appConfig() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger(winstonLoggerOptions),
    });

    const configService = app.get(ConfigService);

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672'],
            queue: configService.get<string>('RABBITMQ_QUEUE') || 'default_queue',
            queueOptions: {
                durable: true,
            },
        },
    });

    await app.startAllMicroservices();

    app.setGlobalPrefix('api/v1');
    return app;
}