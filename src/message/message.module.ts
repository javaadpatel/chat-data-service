import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TaskAggregatorModule } from 'src/task-aggregator/task-aggregator.module';
import {HttpModule, HttpService} from '@nestjs/axios';

// const messageControllerProvider: Provider = {
//     provide: MessageController,
//     useFactory: (httpService: HttpService) => {
//         const messageController = new MessageController(null, httpService);
//         // Add dynamic endpoints to the controller instance here
//         messageController
//         messageController.addDynamicEndpoint('/dynamic-endpoint', 'getDynamicEndpoint');
//         return messageController;
//     },
//     inject: [HttpService]
// }

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        TaskAggregatorModule,
        HttpModule
    ],
    providers: [MessageService],
    exports: [MessageService],
    controllers: [MessageController]
})
export class MessageModule {}
