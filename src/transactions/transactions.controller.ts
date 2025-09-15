import { Controller, Get, Query, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('transactions')
export class TransactionsController {
  constructor(@InjectModel('Order') private orderModel: Model<any>) {}

  // GET /transactions?page=1&limit=20&sort=payment_time&order=desc
  @Get()
  async all(@Query() query: any) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const sortField = query.sort || 'order_status.payment_time';
    const order = query.order === 'asc' ? 1 : -1;

    const matchStage: any = {};
    if (query.status) matchStage['order_status.status'] = query.status;
    if (query.school_id) matchStage['school_id'] = query.school_id;

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'custom_order_id',
          foreignField: 'custom_order_id',
          as: 'order_status_arr',
        },
      },
      { $unwind: { path: '$order_status_arr', preserveNullAndEmptyArrays: true } },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$order_status_arr', '$$ROOT'],
          },
        },
      },
      {
        $project: {
          _id: 0,
          collect_id: '$custom_order_id',
          school_id: '$school_id',
          gateway: '$gateway_name',
          order_amount: '$order_amount',
          transaction_amount: '$transaction_amount',
          status: '$status',
          custom_order_id: '$custom_order_id',
          payment_time: '$payment_time',
        },
      },
    ];

    if (Object.keys(matchStage).length) {
      pipeline.splice(0, 0, { $match: matchStage });
    }

    pipeline.push({ $sort: { [sortField]: order } }, { $skip: skip }, { $limit: limit });

    const data = await this.orderModel.aggregate(pipeline);
    return { page, limit, data };
  }

  @Get('school/:schoolId')
  async bySchool(@Param('schoolId') schoolId: string, @Query() query: any) {
    const pipeline = [
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'custom_order_id',
          foreignField: 'custom_order_id',
          as: 'order_status_arr',
        },
      },
      { $unwind: { path: '$order_status_arr', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          collect_id: '$custom_order_id',
          school_id: '$school_id',
          gateway: '$gateway_name',
          order_amount: '$order_status_arr.order_amount',
          transaction_amount: '$order_status_arr.transaction_amount',
          status: '$order_status_arr.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$order_status_arr.payment_time',
        },
      },
    ];
    const data = await this.orderModel.aggregate(pipeline);
    return data;
  }

  @Get('/status/:custom_order_id')
  async status(@Param('custom_order_id') custom_order_id: string) {
    const pipeline = [
      {
        $match: { custom_order_id },
      },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: 'custom_order_id',
          foreignField: 'custom_order_id',
          as: 'order_status_arr',
        },
      },
      { $unwind: { path: '$order_status_arr', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          custom_order_id: '$custom_order_id',
          status: '$order_status_arr.status',
          order_amount: '$order_status_arr.order_amount',
          transaction_amount: '$order_status_arr.transaction_amount',
          payment_time: '$order_status_arr.payment_time',
        },
      },
    ];
    const [result] = await this.orderModel.aggregate(pipeline);
    return result || { error: 'not_found' };
  }
}
