import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-payment')
  @UseGuards(JwtAuthGuard)
  async createPayment(@Body() body: any, @GetUser() user: any) {
    const amount = body.amount;
    const callback = body.callback_url || process.env.CALLBACK_URL;
    const extra = { student_info: body.student_info, trustee_id: body.trustee_id, gateway_name: body.gateway_name };
    const res = await this.paymentsService.createCollectRequest(String(amount), callback, extra);
    // return collect id and payment url so frontend can redirect.
    return res;
  }

  @Get('check/:collect')
  @UseGuards(JwtAuthGuard)
  async check(@Param('collect') collect: string) {
    return this.paymentsService.checkCollectRequest(collect);
  }
}
