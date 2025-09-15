import { WebhookLog } from './schemas/webhook-log.schema';
import { Model } from 'mongoose';
import { OrderStatusService } from '../order-status/order-status.service';
export declare class WebhookService {
    private webhookLogModel;
    private orderStatusService;
    private logger;
    constructor(webhookLogModel: Model<WebhookLog>, orderStatusService: OrderStatusService);
    process(payload: any): Promise<import("mongoose").Document<unknown, {}, import("../order-status/schemas/order-status.schema").OrderStatus> & import("../order-status/schemas/order-status.schema").OrderStatus & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
