import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'HANDLER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'handler',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'handler-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AppService],
})
export class AppModule {}
