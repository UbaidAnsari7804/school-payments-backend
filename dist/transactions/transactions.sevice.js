"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let TransactionsService = class TransactionsService {
    constructor(orderStatusModel, orderModel) {
        this.orderStatusModel = orderStatusModel;
        this.orderModel = orderModel;
    }
    async getTransactions({ page = 1, limit = 10, status, school_id, sort = 'payment_time', order = 'desc', from, to, search }) {
        const skip = (page - 1) * limit;
        const match = {};
        if (status)
            match['status'] = status;
        if (from || to) {
            match['payment_time'] = {};
            if (from)
                match['payment_time']['$gte'] = new Date(from);
            if (to)
                match['payment_time']['$lte'] = new Date(to);
        }
        if (search) {
            match['$or'] = [
                { custom_order_id: { $regex: search, $options: 'i' } },
                { collect_id: { $regex: search, $options: 'i' } },
            ];
        }
        const pipeline = [
            { $match: match },
            {
                $lookup: {
                    from: this.orderModel.collection.name,
                    localField: 'collect_id',
                    foreignField: '_id',
                    as: 'order',
                },
            },
            { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    collect_id: 1,
                    order_amount: 1,
                    transaction_amount: 1,
                    payment_mode: 1,
                    bank_reference: 1,
                    payment_message: 1,
                    status: 1,
                    error_message: 1,
                    payment_time: 1,
                    custom_order_id: '$order.custom_order_id',
                    school_id: '$order.school_id',
                    gateway: '$order.gateway_name',
                },
            },
        ];
        const sortDir = order === 'asc' ? 1 : -1;
        const sortObj = {};
        sortObj[sort] = sortDir;
        pipeline.push({ $sort: sortObj });
        pipeline.push({ $skip: skip }, { $limit: parseInt(String(limit), 10) });
        const items = await this.orderStatusModel.aggregate(pipeline).exec();
        const countPipeline = pipeline.slice(0, -2);
        countPipeline.push({ $count: 'total' });
        const countRes = await this.orderStatusModel.aggregate(countPipeline).exec();
        const total = (countRes[0] && countRes[0].total) || 0;
        return { data: items, page, limit, total };
    }
    async getBySchool(schoolId) {
        const pipeline = [
            {
                $lookup: {
                    from: this.orderModel.collection.name,
                    localField: 'collect_id',
                    foreignField: '_id',
                    as: 'order',
                },
            },
            { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
            { $match: { 'order.school_id': schoolId } },
            {
                $project: {
                    collect_id: 1,
                    order_amount: 1,
                    transaction_amount: 1,
                    status: 1,
                    custom_order_id: '$order.custom_order_id',
                    school_id: '$order.school_id',
                    gateway: '$order.gateway_name',
                    payment_time: 1,
                },
            },
            { $sort: { payment_time: -1 } },
        ];
        return this.orderStatusModel.aggregate(pipeline).exec();
    }
    async getStatusByCustom(customId) {
        const pipeline = [
            {
                $lookup: {
                    from: this.orderModel.collection.name,
                    localField: 'collect_id',
                    foreignField: '_id',
                    as: 'order',
                },
            },
            { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
            { $match: { 'order.custom_order_id': customId } },
            {
                $project: {
                    collect_id: 1,
                    order_amount: 1,
                    transaction_amount: 1,
                    status: 1,
                    custom_order_id: '$order.custom_order_id',
                    school_id: '$order.school_id',
                    payment_time: 1,
                },
            },
        ];
        const res = await this.orderStatusModel.aggregate(pipeline).exec();
        return res[0] || null;
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('OrderStatus')),
    __param(1, (0, mongoose_2.InjectModel)('Order')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], TransactionsService);
//# sourceMappingURL=transactions.sevice.js.map