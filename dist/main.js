"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Server running on http://localhost:${port}`);
    try {
        const server = app.getHttpAdapter().getInstance();
        if (server && server._router && server._router.stack) {
            const routes = server._router.stack
                .filter((layer) => layer.route && layer.route.path)
                .map((layer) => {
                const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(',');
                return `${methods} ${layer.route.path}`;
            });
            logger.log('Registered routes:\n' + routes.join('\n'));
        }
        else {
            logger.warn('No express router detected (are you using Fastify?)');
        }
    }
    catch (err) {
        logger.error('Error listing routes: ' + err?.message);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map