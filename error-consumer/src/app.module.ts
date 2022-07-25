import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        endpoint: 'http://localhost:4566',
        region: 'us-east-1',
        credentials: {
          accessKeyId: 'test',
          secretAccessKey: 'test',
        },
      },
      services: [SQS],
    }),
  ],
  providers: [PrismaService, AppService],
})
export class AppModule {}
