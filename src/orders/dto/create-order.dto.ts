import { IsString, IsOptional, IsObject, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  school_id: string;

  @IsOptional()
  @IsString()
  trustee_id?: string;

  @IsOptional()
  @IsObject()
  student_info?: { name?: string; id?: string; email?: string };

  @IsOptional()
  @IsString()
  gateway_name?: string;

  @IsOptional()
  @IsString()
  custom_order_id?: string;
}
