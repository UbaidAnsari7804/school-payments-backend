"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const jwt = __importStar(require("jsonwebtoken"));
const orders_service_1 = require("../orders/orders.service");
const order_status_service_1 = require("../order-status/order-status.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(ordersService, orderStatusService) {
        this.ordersService = ordersService;
        this.orderStatusService = orderStatusService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async createCollectRequest(amount, callbackUrl, extra = {}) {
        const payload = {
            school_id: process.env.SCHOOL_ID,
            amount: amount,
            callback_url: callbackUrl,
        };
        const sign = jwt.sign(payload, process.env.PG_KEY || '');
        try {
            const res = await axios_1.default.post(`${process.env.PAYMENT_API_BASE}/create-collect-request`, {
                ...payload,
                sign,
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });
            const data = res.data || {};
            this.logger.log('Payment API response: ' + JSON.stringify(data));
            const order = await this.ordersService.create({
                school_id: process.env.SCHOOL_ID,
                trustee_id: extra.trustee_id || null,
                student_info: extra.student_info || {},
                gateway_name: extra.gateway_name || 'edviron',
                custom_order_id: data.collect_request_id,
            });
            await this.orderStatusService.upsertByCustomId(data.collect_request_id, {
                custom_order_id: data.collect_request_id,
                order_amount: Number(amount),
                status: 'created',
            });
            return { collect_request_id: data.collect_request_id, payment_url: data.Collect_request_url, sign: data.sign };
        }
        catch (err) {
            this.logger.error('Payment API error: ' + (err?.response?.data || err.message));
            throw err;
        }
    }
    async checkCollectRequest(collect_request_id) {
        const signPayload = { school_id: process.env.SCHOOL_ID, collect_request_id };
        const sign = jwt.sign(signPayload, process.env.PG_KEY || '');
        const url = `${process.env.PAYMENT_API_BASE}/collect-request/${collect_request_id}?school_id=${process.env.SCHOOL_ID}&sign=${encodeURIComponent(sign)}`;
        const res = await axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${process.env.PAYMENT_API_KEY}` },
            timeout: 10000,
        });
        return res.data;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        order_status_service_1.OrderStatusService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map