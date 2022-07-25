import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import { PrismaService } from './prisma.service';
@Injectable()
export class AppService {
  private queueUrl = '';

  constructor(
    @InjectAwsService(SQS) private readonly sqs: SQS,
    private readonly prisma: PrismaService,
  ) {}

  async initQueue() {
    return new Promise((res, rej) => {
      this.sqs.listQueues((err, data) => {
        if (err) return rej(err);

        const queue = data?.QueueUrls?.[0];
        if (queue) return res((this.queueUrl = queue));

        this.sqs.createQueue({ QueueName: 'failureQueue' }, (err, data) =>
          err ? rej(err) : res((this.queueUrl = data.QueueUrl)),
        );
      });
    });
  }

  async messageReceived(message: string) {
    try {
      await this.saveMessage(message);
    } catch (err) {
      console.log(err);
      this.handleSavingError(message);
    }
  }

  private async saveMessage(message: string) {
    if (!Math.floor(Math.random() * 2)) throw new Error('I am a dog person');

    await this.prisma.catFacts.create({
      data: {
        fact: message,
      },
    });
  }

  private handleSavingError(message: string) {
    const MessageBody = JSON.stringify({ message });
    this.sqs.sendMessage(
      { MessageBody, QueueUrl: this.queueUrl },
      (err, data) => console.log(err ?? data),
    );
  }
}
