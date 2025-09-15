export declare class CreateOrderDto {
    school_id: string;
    trustee_id?: string;
    student_info?: {
        name?: string;
        id?: string;
        email?: string;
    };
    gateway_name?: string;
    custom_order_id?: string;
}
