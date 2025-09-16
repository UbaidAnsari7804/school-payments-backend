import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from '../order-status/schemas/order-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name || 'Order', schema: OrderSchema },
      { name: OrderStatus.name || 'OrderStatus', schema: OrderStatusSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
