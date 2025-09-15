import { OrderStatus } from './schemas/order-status.schema';
import { Model } from 'mongoose';
export declare class OrderStatusService {
    private orderStatusModel;
    constructor(orderStatusModel: Model<OrderStatus>);
    upsertByCustomId(custom_order_id: string, payload: Partial<OrderStatus>): Promise<import("mongoose").Document<unknown, {}, OrderStatus> & OrderStatus & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findByCustomId(custom_order_id: string): Promise<import("mongoose").FlattenMaps<OrderStatus> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").FlattenMaps<OrderStatus> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
