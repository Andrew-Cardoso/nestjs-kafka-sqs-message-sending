import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectAwsService } from 'nest-aws-sdk';
import { SQS } from 'aws-sdk';
import { PrismaService } from './prisma.service';
import { CatFacts } from '@prisma/client';

const QueueUrl = 'http://localhost:4566/000000000000/failureQueue';

@Injectable()
export class AppService {
  constructor(
    @InjectAwsService(SQS) private readonly sqs: SQS,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async saveFailedMessages() {
    const sqsMessages = await this.readNextMessage();
    if (!sqsMessages.length) return;

    const promises: Promise<any>[] = [];

    for (const { ReceiptHandle, Body } of sqsMessages) {
      const fact = JSON.parse(Body).message as string;
      promises.push(this.prisma.catFacts.create({ data: { fact } }));
      promises.push(
        new Promise((res, rej) =>
          this.sqs.deleteMessage({ QueueUrl, ReceiptHandle }, (err, data) =>
            err ? rej(err) : res(data),
          ),
        ),
      );
    }

    await Promise.all(promises);
  }

  private async readNextMessage(): Promise<SQS.MessageList> {
    return new Promise((res) =>
      this.sqs.receiveMessage(
        {
          QueueUrl,
          MaxNumberOfMessages: 10,
        },
        (err, data) => res(data?.Messages ?? []),
      ),
    );
  }
}
