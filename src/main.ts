import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await appConfig();

  await app.listen(3000);
}
bootstrap();
