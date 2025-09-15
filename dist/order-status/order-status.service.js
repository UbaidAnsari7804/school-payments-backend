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
exports.OrderStatusService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const order_status_schema_1 = require("./schemas/order-status.schema");
const mongoose_2 = require("mongoose");
let OrderStatusService = class OrderStatusService {
    constructor(orderStatusModel) {
        this.orderStatusModel = orderStatusModel;
    }
    async upsertByCustomId(custom_order_id, payload) {
        return this.orderStatusModel.findOneAndUpdate({ custom_order_id }, { $set: payload }, { upsert: true, new: true });
    }
    async findByCustomId(custom_order_id) {
        return this.orderStatusModel.findOne({ custom_order_id }).lean();
    }
    async findAll() {
        return this.orderStatusModel.find().lean();
    }
};
exports.OrderStatusService = OrderStatusService;
exports.OrderStatusService = OrderStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_status_schema_1.OrderStatus.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderStatusService);
//# sourceMappingURL=order-status.service.js.map