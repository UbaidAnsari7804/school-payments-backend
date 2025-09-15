import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebhookLog } from './schemas/webhook-log.schema';
import { Model } from 'mongoose';
import { OrderStatusService } from '../order-status/order-status.service';

@Injectable()
export class WebhookService {
  private logger = new Logger(WebhookService.name);
  constructor(
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLog>,
    private orderStatusService: OrderStatusService,
  ) {}

  async process(payload: any) {
    await this.webhookLogModel.create({ payload, receivedAt: new Date() });

    const info = payload.order_info || payload;
    const order_id_raw = info.order_id || info.collect_id || '';
    const collect_id = (order_id_raw || '').split('/')[0];

    const updatePayload: any = {
      order_amount: info.order_amount,
      transaction_amount: info.transaction_amount,
      payment_mode: info.payment_mode,
      payment_details: info.payemnt_details || info.payment_details,
      bank_reference: info.bank_reference,
      payment_message: info.Payment_message || info.payment_message,
      status: info.status,
      error_message: info.error_message,
      payment_time: info.payment_time ? new Date(info.payment_time) : undefined,
    };

    // Remove undefineds
    Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);

    // Upsert order status by custom_order_id (=collect_id)
    const updated = await this.orderStatusService.upsertByCustomId(collect_id, updatePayload);
    this.logger.log(`Webhook processed for collect_id=${collect_id}`);
    return updated;
  }
}
