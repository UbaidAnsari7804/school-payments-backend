import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async create(createDto: CreateOrderDto) {
    const created = new this.orderModel(createDto);
    return created.save();
  }

  async findById(id: string) {
    return this.orderModel.findById(id);
  }

  async findAll() {
    return this.orderModel.find().lean();
  }

  async findBySchool(schoolId: string) {
    return this.orderModel.find({ school_id: schoolId }).lean();
  }

  async findByCustomOrderId(customId: string) {
    return this.orderModel.findOne({ custom_order_id: customId }).lean();
  }
}
