import { Document, Schema as MSchema } from 'mongoose';
export declare class OrderStatus extends Document {
    collect_id: string;
    custom_order_id: string;
    order_amount: number;
    transaction_amount: number;
    payment_mode: string;
    payment_details: string;
    bank_reference: string;
    payment_message: string;
    status: string;
    error_message: string;
    payment_time: Date;
}
export declare const OrderStatusSchema: MSchema<OrderStatus, import("mongoose").Model<OrderStatus, any, any, any, Document<unknown, any, OrderStatus> & OrderStatus & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderStatus, Document<unknown, {}, import("mongoose").FlatRecord<OrderStatus>> & import("mongoose").FlatRecord<OrderStatus> & {
    _id: import("mongoose").Types.ObjectId;
}>;
