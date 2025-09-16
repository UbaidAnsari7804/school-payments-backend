import { config } from 'dotenv';
config();
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, required: false },
  trustee_id: String,
  student_info: Object,
  gateway_name: String,
  custom_order_id: String,
}, { timestamps: true });

const OrderStatusSchema = new mongoose.Schema({
  collect_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  custom_order_id: String,
  order_amount: Number,
  transaction_amount: Number,
  payment_mode: String,
  payment_details: String,
  bank_reference: String,
  payment_message: String,
  status: String,
  error_message: String,
  payment_time: Date,
}, { timestamps: true });

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('.env MONGO_URI not set');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const Order = mongoose.model('Order', OrderSchema);
  const OrderStatus = mongoose.model('OrderStatus', OrderStatusSchema);

  await Order.deleteMany({});
  await OrderStatus.deleteMany({});

  const orders = [];
  for (let i = 1; i <= 5; i++) {
    const custom = 'collect_' + Date.now() + '_' + i;
    orders.push({
      school_id: process.env.SCHOOL_ID || null,
      trustee_id: `trustee_${i}`,
      student_info: { name: `Student ${i}`, id: `s${i}`, email: `s${i}@school.com` },
      gateway_name: 'edviron',
      custom_order_id: custom,
    });
  }
  const createdOrders = await Order.insertMany(orders);

  const statuses = createdOrders.map((o: any, idx: number) => ({
    custom_order_id: o.custom_order_id,
    order_amount: 1000 + idx * 100,
    transaction_amount: 1000 + idx * 100 + 50,
    payment_mode: idx % 2 === 0 ? 'card' : 'upi',
    payment_details: `${idx}@example`,
    bank_reference: `BANKREF${idx}`,
    payment_message: 'sample',
    status: idx % 3 === 0 ? 'success' : idx % 3 === 1 ? 'pending' : 'failed',
    payment_time: new Date(),
  }));

  await OrderStatus.insertMany(statuses);

  console.log('Seed completed');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
