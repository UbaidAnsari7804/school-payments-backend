import { Controller, Post, Body, Logger } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  private logger = new Logger(WebhookController.name);
  constructor(private webhookService: WebhookService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any) {
    this.logger.log('Received webhook: ' + JSON.stringify(body));
    const res = await this.webhookService.process(body);
    return { ok: true, updated: res };
  }
}
