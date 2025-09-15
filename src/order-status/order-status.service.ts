import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrderStatus } from './schemas/order-status.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrderStatusService {
  constructor(@InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatus>) {}

  async upsertByCustomId(custom_order_id: string, payload: Partial<OrderStatus>) {
    return this.orderStatusModel.findOneAndUpdate(
      { custom_order_id },
      { $set: payload },
      { upsert: true, new: true }
    );
  }

  async findByCustomId(custom_order_id: string) {
    return this.orderStatusModel.findOne({ custom_order_id }).lean();
  }

  async findAll() {
    return this.orderStatusModel.find().lean();
  }
}
