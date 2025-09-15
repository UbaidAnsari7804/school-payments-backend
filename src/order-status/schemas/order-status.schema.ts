import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

@Schema({ timestamps: true })
export class OrderStatus extends Document {
  @Prop({ type: MSchema.Types.ObjectId, ref: 'Order', index: true })
  collect_id: string; // reference to Order._id if you used that

  @Prop()
  custom_order_id: string; // store collect_request_id

  @Prop({ type: Number })
  order_amount: number;

  @Prop({ type: Number })
  transaction_amount: number;

  @Prop()
  payment_mode: string;

  @Prop()
  payment_details: string;

  @Prop()
  bank_reference: string;

  @Prop()
  payment_message: string;

  @Prop()
  status: string;

  @Prop()
  error_message: string;

  @Prop()
  payment_time: Date;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);
OrderStatusSchema.index({ custom_order_id: 1 });
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ status: 1 });
