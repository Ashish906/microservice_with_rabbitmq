import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe()
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'auth_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'user_queue',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
