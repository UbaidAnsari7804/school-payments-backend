import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(body: any, user: any): Promise<{
        collect_request_id: any;
        payment_url: any;
        sign: any;
    }>;
    check(collect: string): Promise<any>;
}
