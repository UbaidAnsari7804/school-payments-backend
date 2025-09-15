import { OrderStatusService } from './order-status.service';
export declare class OrderStatusController {
    private readonly orderStatusService;
    constructor(orderStatusService: OrderStatusService);
    getByCustom(custom: string): Promise<import("mongoose").FlattenMaps<import("./schemas/order-status.schema").OrderStatus> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
