import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // better for production logging
  });

  // Security middlewares
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // restrict to your frontend in prod
    methods: 'GET,POST,PUT,DELETE',
  });

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Optional: set a global prefix like /api
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${port}`);
}
bootstrap();
