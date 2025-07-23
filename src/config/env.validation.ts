import Joi from 'joi';

export const envValidation = Joi.object({
    ENV: Joi.string().valid('DEVELOPMENT', 'PRODUCTION').required(),
    PORT: Joi.number().default(3000),
    RABBITMQ_URL: Joi.string().uri().required(),
    RABBITMQ_QUEUE: Joi.string().required(),
});
