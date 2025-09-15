import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class WebhookLog extends Document {
  @Prop({ type: Object })
  payload: any;

  @Prop()
  receivedAt: Date;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
