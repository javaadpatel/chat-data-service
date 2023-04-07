import { Module } from '@nestjs/common';
import { LogInterceptor } from './log.interceptor';

@Module({
    providers: [
        LogInterceptor
    ],
    exports: [
        LogInterceptor
    ]
})
export class CommonModule {}
