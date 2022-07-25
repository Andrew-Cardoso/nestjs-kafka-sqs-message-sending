import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'handler-consumer',
          },
        },
      },
    );

    const appService = app.get(AppService);
    await appService.initQueue();
    await app.listen();
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
