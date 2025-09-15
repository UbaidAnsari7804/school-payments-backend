import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: MSchema.Types.ObjectId })
  school_id: string;

  @Prop({ type: String })
  trustee_id: string;

  @Prop({ type: Object })
  student_info: { name: string; id: string; email: string };

  @Prop()
  gateway_name: string;

  @Prop({ index: true })
  custom_order_id?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ custom_order_id: 1 });
