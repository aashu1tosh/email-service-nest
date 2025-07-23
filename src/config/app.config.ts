// Update your appConfig to use raw queue consumption
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

    // Configure for direct queue consumption
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: 'forgot-password.queue',
            queueOptions: {
                durable: true,
            },
            // Important: This tells NestJS to consume raw messages
            noAck: false,
            // Disable pattern-based routing
            serializer: {
                serialize: (value: any) => value,
            },
            deserializer: {
                deserialize: (value: any, options?: any) => {
                    return JSON.parse(value.toString());
                },
            },
        },
    });

    await app.startAllMicroservices();
    app.setGlobalPrefix('api/v1');
    return app;
}