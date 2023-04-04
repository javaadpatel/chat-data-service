import { Module } from '@nestjs/common';
import { TaskAggregatorService } from './task-aggregator.service';

@Module({
    providers: [TaskAggregatorService],
    exports: [TaskAggregatorService]
})
export class TaskAggregatorModule {}
