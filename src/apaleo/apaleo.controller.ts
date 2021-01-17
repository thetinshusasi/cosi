import { Controller, Post } from '@nestjs/common';
import db from './db';
import sqs from './sqs';
import slack from './slack';

@Controller('apaleo')
export class ApaleoController {
  @Post('/reservation-webhook')
  //Code review comment: validate data with DTO
  //Code review comment: implement providers for slack ,db, and sqs services amd inject it via constructor
  //Code review comment: create appropriate  interfaces/Dtos
  async onNewReservation(data: any) {
    const isDuplicate = await db.getWebhook(data.id);
    if (!isDuplicate) {
      //Code review comment: implement try and catch and possibly rollback if
      //anything fails in  saveWebhook or sendQueueMessage
      await db.saveWebhook(data.id);
      //Code review comment: we can do parallely
      await slack.sendSlackNotification(data.reservation);

      await sqs.sendQueueMessage(
        data.reservation,
        //Code review comment: implement provider and split the url by base url
        //and rest url parts
        'https://eu-central-1.aws.amazon.com/sqs',
      );
    }
    return {
      message: 'Processed',
    };
  }
}
