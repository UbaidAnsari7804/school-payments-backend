import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private webhookService;
    private logger;
    constructor(webhookService: WebhookService);
    handleWebhook(body: any): Promise<{
        ok: boolean;
        updated: import("mongoose").Document<unknown, {}, import("../order-status/schemas/order-status.schema").OrderStatus> & import("../order-status/schemas/order-status.schema").OrderStatus & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
}
