import { Controller, Get, Query, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: string,
    @Query('school_id') school_id?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('search') search?: string,
  ) {
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    return this.transactionsService.getTransactions({
      page: p,
      limit: l,
      status,
      school_id,
      sort,
      order,
      from,
      to,
      search,
    });
  }

  @Get('school/:schoolId')
  async bySchool(@Param('schoolId') schoolId: string) {
    return this.transactionsService.getBySchool(schoolId);
  }

  @Get('status/:custom_order_id')
  async status(@Param('custom_order_id') custom) {
    return this.transactionsService.getStatusByCustom(custom);
  }
}
