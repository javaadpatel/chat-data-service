import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';
import { LogInterceptor } from './common/log.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const logger = new Logger("boostrap");
  const port = 3005;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //seed database
  const seederService = app.get(SeederService);
  await seederService.seed();

  //apply interceptors
  const logInterceptor = app.get(LogInterceptor);
  app.useGlobalInterceptors(logInterceptor);
  const httpExceptionFilter = app.get(HttpExceptionFilter);
  app.useGlobalFilters(httpExceptionFilter); 
  
  await app.listen(port);

  logger.log(`Started application on port: ${port}`)
}
bootstrap();
