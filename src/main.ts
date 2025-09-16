// src/main.ts  — replace file content with this for debugging
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // NOTE: keep no prefix for this test
  // app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);

  // Print express routes (works if using Express adapter)
  try {
    const server: any = app.getHttpAdapter().getInstance();
    if (server && server._router && server._router.stack) {
      const routes = server._router.stack
        .filter((layer: any) => layer.route && layer.route.path)
        .map((layer: any) => {
          const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
          return `${methods} ${layer.route.path}`;
        });
      logger.log('Registered routes:\n' + routes.join('\n'));
    } else {
      logger.warn('No express router detected (are you using Fastify?)');
    }
  } catch (err: any) {
    logger.error('Error listing routes: ' + err?.message);
  }
}
bootstrap();
