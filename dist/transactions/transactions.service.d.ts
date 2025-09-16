import { Model } from 'mongoose';
export declare class TransactionsService {
    private orderStatusModel;
    private orderModel;
    constructor(orderStatusModel: Model<any>, orderModel: Model<any>);
    private buildOrderLookup;
    getTransactions({ page, limit, status, school_id, sort, order, from, to, search }: {
        page?: number;
        limit?: number;
        status: any;
        school_id: any;
        sort?: string;
        order?: string;
        from: any;
        to: any;
        search: any;
    }): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
    }>;
    getBySchool(schoolId: string): Promise<any>;
    getStatusByCustom(customId: string): Promise<any>;
}
