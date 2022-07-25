import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
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
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
