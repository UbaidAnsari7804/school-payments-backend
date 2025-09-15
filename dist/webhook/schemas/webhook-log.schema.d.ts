import { Document } from 'mongoose';
export declare class WebhookLog extends Document {
    payload: any;
    receivedAt: Date;
}
export declare const WebhookLogSchema: import("mongoose").Schema<WebhookLog, import("mongoose").Model<WebhookLog, any, any, any, Document<unknown, any, WebhookLog> & WebhookLog & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WebhookLog, Document<unknown, {}, import("mongoose").FlatRecord<WebhookLog>> & import("mongoose").FlatRecord<WebhookLog> & {
    _id: import("mongoose").Types.ObjectId;
}>;
