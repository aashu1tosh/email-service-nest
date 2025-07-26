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
            queue: 'forgot-password.queue',
            queueOptions: {
                durable: true,
            },
            noAck: false,
            serializer: {
                serialize: (value: any) => {
                    // If sending, keep as-is or add pattern if needed
                    return value;
                },
            },
            deserializer: {
                deserialize: (value: any, options?: any) => {
                    console.log("🚀 Raw message received:", value);

                    // If value is already structured with pattern, return as-is
                    if (value && typeof value === 'object' && value.pattern) {
                        console.log("✅ Message already has pattern:", value.pattern);
                        return value;
                    }

                    // If it's raw data, auto-wrap it with a pattern
                    if (value && typeof value === 'object' && value.to && value.resetToken) {
                        const wrappedMessage = {
                            pattern: 'forgot-password', // Auto-assign pattern
                            data: value
                        };
                        console.log("🔄 Auto-wrapped raw message with pattern:", wrappedMessage);
                        return wrappedMessage;
                    }

                    // For other raw messages, assign a generic pattern
                    const genericWrapped = {
                        pattern: 'unknown-message',
                        data: value
                    };
                    console.log("⚠️ Wrapped unknown message:", genericWrapped);
                    return genericWrapped;
                },
            },
        },
    });

    await app.startAllMicroservices();
    app.setGlobalPrefix('api/v1');
    return app;
}