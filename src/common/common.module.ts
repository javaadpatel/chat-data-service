import { Module } from '@nestjs/common';
import { LogInterceptor } from './log.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
    providers: [
        LogInterceptor,
        HttpExceptionFilter
    ],
    exports: [
        LogInterceptor,
        HttpExceptionFilter
    ]
})
export class CommonModule {}
