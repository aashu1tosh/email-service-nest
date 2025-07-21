import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";


export async function appConfig() {
    const app = await NestFactory.create(AppModule);
    const logger = await app.resolve(CustomLoggerService);
    app.useLogger(logger);

    app.setGlobalPrefix('api/v1');

}