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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const webhook_log_schema_1 = require("./schemas/webhook-log.schema");
const mongoose_2 = require("mongoose");
const order_status_service_1 = require("../order-status/order-status.service");
let WebhookService = WebhookService_1 = class WebhookService {
    constructor(webhookLogModel, orderStatusService) {
        this.webhookLogModel = webhookLogModel;
        this.orderStatusService = orderStatusService;
        this.logger = new common_1.Logger(WebhookService_1.name);
    }
    async process(payload) {
        await this.webhookLogModel.create({ payload, receivedAt: new Date() });
        const info = payload.order_info || payload;
        const order_id_raw = info.order_id || info.collect_id || '';
        const collect_id = (order_id_raw || '').split('/')[0];
        const updatePayload = {
            order_amount: info.order_amount,
            transaction_amount: info.transaction_amount,
            payment_mode: info.payment_mode,
            payment_details: info.payemnt_details || info.payment_details,
            bank_reference: info.bank_reference,
            payment_message: info.Payment_message || info.payment_message,
            status: info.status,
            error_message: info.error_message,
            payment_time: info.payment_time ? new Date(info.payment_time) : undefined,
        };
        Object.keys(updatePayload).forEach((k) => updatePayload[k] === undefined && delete updatePayload[k]);
        const updated = await this.orderStatusService.upsertByCustomId(collect_id, updatePayload);
        this.logger.log(`Webhook processed for collect_id=${collect_id}`);
        return updated;
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(webhook_log_schema_1.WebhookLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        order_status_service_1.OrderStatusService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map