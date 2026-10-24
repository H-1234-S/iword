import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // web 默认占用 3000，api 与之错开
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
