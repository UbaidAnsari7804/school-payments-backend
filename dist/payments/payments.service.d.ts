import { OrdersService } from '../orders/orders.service';
import { OrderStatusService } from '../order-status/order-status.service';
export declare class PaymentsService {
    private ordersService;
    private orderStatusService;
    private logger;
    constructor(ordersService: OrdersService, orderStatusService: OrderStatusService);
    createCollectRequest(amount: string, callbackUrl: string, extra?: any): Promise<{
        collect_request_id: any;
        payment_url: any;
        sign: any;
    }>;
    checkCollectRequest(collect_request_id: string): Promise<any>;
}
