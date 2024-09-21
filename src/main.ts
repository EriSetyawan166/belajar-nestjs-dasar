import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as mustache from 'mustache-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { log } from 'console';
import { ValidationFilter } from './validation/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  // app.useLogger(logger);
  app.use(cookieParser("My Secret Key"));
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'html');
  app.engine('html', mustache());
  app.enableShutdownHooks();
  // app.useGlobalFilters(new ValidationFilter());
  // app.useGlobalPipes()
  // app.useGlobalInterceptors()
  // app.useGlobalGuards()

  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
 