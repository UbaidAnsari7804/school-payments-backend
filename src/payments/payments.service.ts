import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { OrdersService } from '../orders/orders.service';
import { OrderStatusService } from '../order-status/order-status.service';

@Injectable()
export class PaymentsService {
  private logger = new Logger(PaymentsService.name);

  constructor(
    private ordersService: OrdersService,
    private orderStatusService: OrderStatusService,
  ) {}

  async createCollectRequest(amount: string, callbackUrl: string, extra: any = {}) {
    const payload = {
      school_id: process.env.SCHOOL_ID,
      amount: amount,
      callback_url: callbackUrl,
    };

    const sign = jwt.sign(payload, process.env.PG_KEY || '');

    try {
      const res = await axios.post(
        `${process.env.PAYMENT_API_BASE}/create-collect-request`,
        {
          ...payload,
          sign,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      // format: res.data.collect_request_id, res.data.Collect_request_url
      const data = res.data || {};
      this.logger.log('Payment API response: ' + JSON.stringify(data));

      // store Order & OrderStatus stub
      const order = await this.ordersService.create({
        school_id: process.env.SCHOOL_ID,
        trustee_id: extra.trustee_id || null,
        student_info: extra.student_info || {},
        gateway_name: extra.gateway_name || 'edviron',
        custom_order_id: data.collect_request_id,
      });

      await this.orderStatusService.upsertByCustomId(data.collect_request_id, {
        custom_order_id: data.collect_request_id,
        order_amount: Number(amount),
        status: 'created',
      });

      return { collect_request_id: data.collect_request_id, payment_url: data.Collect_request_url, sign: data.sign };
    } catch (err: any) {
      this.logger.error('Payment API error: ' + (err?.response?.data || err.message));
      throw err;
    }
  }

  async checkCollectRequest(collect_request_id: string) {
    const signPayload = { school_id: process.env.SCHOOL_ID, collect_request_id };
    const sign = jwt.sign(signPayload, process.env.PG_KEY || '');
    const url = `${process.env.PAYMENT_API_BASE}/collect-request/${collect_request_id}?school_id=${process.env.SCHOOL_ID}&sign=${encodeURIComponent(sign)}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${process.env.PAYMENT_API_KEY}` },
      timeout: 10000,
    });
    return res.data;
  }
}
