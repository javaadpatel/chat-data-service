import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { SeederModule } from './seeder/seeder.module';
import { TaskAggregatorModule } from './task-aggregator/task-aggregator.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot(({
      type: 'mysql' as const,
      host: 'localhost',
      port: 3308,
      username: 'root',
      password: 'password',
      database: 'chat',
      autoLoadEntities: true,
      synchronize: true
    })),
    EventEmitterModule.forRoot(),
    MessageModule,
    SeederModule,
    TaskAggregatorModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
