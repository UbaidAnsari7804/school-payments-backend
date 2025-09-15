import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
