import Joi from 'joi';

export const envValidation = Joi.object({
    ENV: Joi.string().valid('DEVELOPMENT', 'PRODUCTION').required(),
    PORT: Joi.number().default(3000),

    // RabbitMQ configuration
    RABBITMQ_URL: Joi.string().uri().required(),
    RABBITMQ_QUEUE: Joi.string().required(),

    // smtp configuration
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().default(587),
    SMTP_SECURE: Joi.boolean().default(false),
    SMTP_USER: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
    DEFAULT_EMAIL_FROM: Joi.string().required(),

    FRONTEND_URL: Joi.string().uri().required(),
    RESTORE_PASSWORD_PATH: Joi.string().required(),
});
