import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';

const url = 'https://meowfacts.herokuapp.com/';

@Injectable()
export class AppService {
  constructor(
    @Inject('HANDLER_SERVICE') private readonly handlerClient: ClientKafka,
    private readonly http: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  private async sendMessage() {
    try {
      const response = await this.http.axiosRef.get(url);
      const message = response.data.data[0];
      this.handlerClient.emit('message_received', { message });
    } catch (error) {
      console.log(error);
    }
  }
}
