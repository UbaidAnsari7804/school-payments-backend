import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookLog, WebhookLogSchema } from './schemas/webhook-log.schema';
import { OrderStatusModule } from '../order-status/order-status.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WebhookLog.name, schema: WebhookLogSchema }]),
    OrderStatusModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
