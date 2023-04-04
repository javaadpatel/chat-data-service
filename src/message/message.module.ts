import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TaskAggregatorModule } from 'src/task-aggregator/task-aggregator.module';
import {HttpModule} from '@nestjs/axios';

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
