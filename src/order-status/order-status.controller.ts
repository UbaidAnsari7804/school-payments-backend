import { Controller, Get, Param } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';

@Controller('order-status')
export class OrderStatusController {
  constructor(private readonly orderStatusService: OrderStatusService) {}

  @Get(':custom')
  async getByCustom(@Param('custom') custom: string) {
    return this.orderStatusService.findByCustomId(custom);
  }
}
