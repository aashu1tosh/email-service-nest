import { MESSAGE_PATTERNS } from '@/constant/queue.constant';
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
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: configService.get<string>('RABBITMQ_QUEUE')!,
            queueOptions: {
                durable: true,
            },
            noAck: false,
            deserializer: {
                deserialize: (value: any, options?: any) => {
                    const wrappedMessage = {
                        pattern: MESSAGE_PATTERNS.FORGOT_PASSWORD,
                        // Auto-assign pattern
                        data: value
                    };
                    return wrappedMessage;

                },
            },
        },
    });

    await app.startAllMicroservices();
    app.setGlobalPrefix('api/v1');
    return app;
}