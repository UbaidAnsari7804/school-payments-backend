import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private orderModel;
    constructor(orderModel: Model<Order>);
    create(createDto: CreateOrderDto): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").FlattenMaps<Order> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findBySchool(schoolId: string): Promise<(import("mongoose").FlattenMaps<Order> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findByCustomOrderId(customId: string): Promise<import("mongoose").FlattenMaps<Order> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
