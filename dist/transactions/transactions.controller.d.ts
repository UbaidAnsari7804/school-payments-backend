import { Model } from 'mongoose';
export declare class TransactionsController {
    private orderModel;
    constructor(orderModel: Model<any>);
    all(query: any): Promise<{
        page: number;
        limit: number;
        data: any[];
    }>;
    bySchool(schoolId: string, query: any): Promise<any[]>;
    status(custom_order_id: string): Promise<any>;
}
