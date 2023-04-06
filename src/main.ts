import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Controller, Get, Logger, ValidationPipe } from '@nestjs/common';
import { SeederService } from './seeder/seeder.service';
import { RouteInfo, Scope, Type } from '@nestjs/common/interfaces';
import { SimpleModule } from './simple/simple.module';

// export const getDynamicRouteInfo = (path: string): RouteInfo => ({
//   path,
//   method: RequestMethod.GET,
//   fn: async (req, res, next) => {
//     // Get the MessageController instance with the dynamic endpoint
//     const messageController = new MessageController();
//     messageController.addDynamicEndpoint(path, 'getDynamicEndpoint');

//     // Call the dynamic endpoint method
//     const result = await messageController.getDynamicEndpoint(req, res, next);

//     // Return the result
//     res.send(result);
//   },
// });

export function getControllerClass({ customPath }): Type<any> {
  @Controller({scope: Scope.REQUEST})
  class MyController {

    @Get([customPath])
    getSomething() {
      return 'dynamic'
    }    
  }
  return MyController
}


async function bootstrap() {
  const logger = new Logger("boostrap");
  const port = 3005;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // const router = app.getHttpAdapter().getInstance();
  // console.log({router})
  // console.log("bootstrap")
  // const x = app.get(SimpleModule);
  // app.use('/simple-dynamic', getControllerClass({customPath: 't'}));

  //seed database
  const seederService = app.get(SeederService);
  await seederService.seed();
  
  await app.listen(port);

  logger.log(`Started application on port: ${port}`)
}
bootstrap();
