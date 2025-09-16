// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('OrderStatus') private orderStatusModel: Model<any>,
    @InjectModel('Order') private orderModel: Model<any>,
  ) {}

  // Build a lookup that tries multiple match strategies:
  // - match orders._id (string/ObjectId) with collect_id
  // - match orders.custom_order_id with custom_order_id from order_status
  private buildOrderLookup() {
    return {
      $lookup: {
        from: this.orderModel.collection.name,
        let: { cid: '$collect_id', cust: '$custom_order_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  // 1) If collect_id exists: match by stringified _id or convert to ObjectId
                  {
                    $and: [
                      { $ne: ['$$cid', null] },
                      {
                        $or: [
                          { $eq: [{ $toString: '$_id' }, '$$cid'] },
                          {
                            $and: [
                              { $regexMatch: { input: '$$cid', regex: /^[0-9a-fA-F]{24}$/ } },
                              { $eq: ['$_id', { $toObjectId: '$$cid' }] },
                            ],
                          },
                          { $eq: ['$_id', '$$cid'] },
                        ],
                      },
                    ],
                  },
                  // 2) If custom_order_id exists on order_status: match orders.custom_order_id == cust OR stringified _id == cust
                  {
                    $and: [
                      { $ne: ['$$cust', null] },
                      {
                        $or: [
                          { $eq: ['$custom_order_id', '$$cust'] },
                          { $eq: [{ $toString: '$_id' }, '$$cust'] },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'order',
      },
    };
  }

  // GET /transactions
  async getTransactions({ page = 1, limit = 10, status, school_id, sort = 'payment_time', order = 'desc', from, to, search }) {
    const skip = (page - 1) * limit;
    const match: any = {};

    if (status) match['status'] = status;
    if (from || to) {
      match['payment_time'] = {};
      if (from) match['payment_time']['$gte'] = new Date(from);
      if (to) match['payment_time']['$lte'] = new Date(to);
    }
    if (search) {
      match['$or'] = [
        { custom_order_id: { $regex: search, $options: 'i' } },
        { collect_id: { $regex: search, $options: 'i' } },
      ];
    }

    const pipeline: any[] = [{ $match: match }];

    // robust lookup
    pipeline.push(this.buildOrderLookup());
    pipeline.push({ $unwind: { path: '$order', preserveNullAndEmptyArrays: true } });

    // if school filter provided, allow matching on order.school_id or order.school._id (string/ObjectId)
    if (school_id) {
      pipeline.push({
        $match: {
          $expr: {
            $or: [
              { $eq: ['$order.school_id', school_id] },
              { $eq: [{ $toString: '$order.school_id' }, school_id] },
              { $eq: ['$order.school._id', school_id] },
              { $eq: [{ $toString: '$order.school._id' }, school_id] },
            ],
          },
        },
      });
    }

    pipeline.push({
      $project: {
        // include the order_status's own id and fields
        _id: 1,
        collect_id: 1,
        custom_order_id: { $ifNull: ['$order.custom_order_id', '$custom_order_id'] },
        order_amount: 1,
        transaction_amount: 1,
        payment_mode: 1,
        payment_details: 1,
        bank_reference: 1,
        payment_message: 1,
        status: 1,
        error_message: 1,
        payment_time: 1,
        // school id may be in order.school_id or nested order.school._id
        school_id: {
          $ifNull: ['$order.school_id', { $ifNull: ['$order.school._id', null] }],
        },
        gateway: { $ifNull: ['$order.gateway_name', '$order.gateway'] },
      },
    });

    // sorting
    const sortDir = order === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sort] = sortDir;
    pipeline.push({ $sort: sortObj });

    // pagination
    pipeline.push({ $skip: skip }, { $limit: parseInt(String(limit), 10) });

    const items = await (this.orderStatusModel.aggregate(pipeline as any) as any).exec();

    // total count
    const countPipeline = pipeline.slice(0, -2); // remove skip & limit
    countPipeline.push({ $count: 'total' });
    const countRes = await (this.orderStatusModel.aggregate(countPipeline as any) as any).exec();
    const total = (countRes && countRes[0] && countRes[0].total) || 0;

    return { data: items, page, limit, total };
  }

  // GET /transactions/school/:schoolId
  async getBySchool(schoolId: string) {
    const pipeline: any[] = [];
    pipeline.push(this.buildOrderLookup());
    pipeline.push({ $unwind: { path: '$order', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $match: {
        $expr: {
          $or: [
            { $eq: ['$order.school_id', schoolId] },
            { $eq: [{ $toString: '$order.school_id' }, schoolId] },
            { $eq: ['$order.school._id', schoolId] },
            { $eq: [{ $toString: '$order.school._id' }, schoolId] },
          ],
        },
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        collect_id: 1,
        custom_order_id: { $ifNull: ['$order.custom_order_id', '$custom_order_id'] },
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        school_id: { $ifNull: ['$order.school_id', { $ifNull: ['$order.school._id', null] }] },
        gateway: { $ifNull: ['$order.gateway_name', '$order.gateway'] },
        payment_time: 1,
      },
    });

    pipeline.push({ $sort: { payment_time: -1 } });

    return (this.orderStatusModel.aggregate(pipeline as any) as any).exec();
  }

  // GET /transactions/status/:custom_order_id
  async getStatusByCustom(customId: string) {
    const pipeline: any[] = [];

    pipeline.push(this.buildOrderLookup());
    pipeline.push({ $unwind: { path: '$order', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $match: {
        $or: [
          { 'order.custom_order_id': customId },
          { custom_order_id: customId },
          { _id: customId },
        ],
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        collect_id: 1,
        custom_order_id: { $ifNull: ['$order.custom_order_id', '$custom_order_id'] },
        order_amount: 1,
        transaction_amount: 1,
        status: 1,
        school_id: { $ifNull: ['$order.school_id', { $ifNull: ['$order.school._id', null] }] },
        payment_time: 1,
      },
    });

    const res = await (this.orderStatusModel.aggregate(pipeline as any) as any).exec();
    return res[0] || null;
  }
}
