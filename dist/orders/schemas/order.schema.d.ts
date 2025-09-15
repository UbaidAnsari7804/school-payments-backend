import { Document, Schema as MSchema } from 'mongoose';
export declare class Order extends Document {
    school_id: string;
    trustee_id: string;
    student_info: {
        name: string;
        id: string;
        email: string;
    };
    gateway_name: string;
    custom_order_id?: string;
}
export declare const OrderSchema: MSchema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order> & Order & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
}>;
