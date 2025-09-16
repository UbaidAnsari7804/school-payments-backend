import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { OrderStatusModule } from './order-status/order-status.module';
import { PaymentsModule } from './payments/payments.module';
import { WebhookModule } from './webhook/webhook.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || '', { autoCreate: true }),
    AuthModule,
    OrdersModule,
    OrderStatusModule,
    PaymentsModule,
    WebhookModule,
    TransactionsModule,
  ],
})
export class AppModule {}
