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
exports.TransactionsController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TransactionsController = class TransactionsController {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async all(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const sortField = query.sort || 'order_status.payment_time';
        const order = query.order === 'asc' ? 1 : -1;
        const matchStage = {};
        if (query.status)
            matchStage['order_status.status'] = query.status;
        if (query.school_id)
            matchStage['school_id'] = query.school_id;
        const pipeline = [
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
    async bySchool(schoolId, query) {
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
    async status(custom_order_id) {
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
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('school/:schoolId'),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "bySchool", null);
__decorate([
    (0, common_1.Get)('/status/:custom_order_id'),
    __param(0, (0, common_1.Param)('custom_order_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "status", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, common_1.Controller)('transactions'),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionsController);
//# sourceMappingURL=transactions.controller.js.map