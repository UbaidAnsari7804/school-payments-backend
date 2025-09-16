import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    getAll(page?: string, limit?: string, status?: string, school_id?: string, sort?: string, order?: string, from?: string, to?: string, search?: string): Promise<{
        data: any;
        page: number;
        limit: number;
        total: any;
    }>;
    bySchool(schoolId: string): Promise<any>;
    status(custom: any): Promise<any>;
}
