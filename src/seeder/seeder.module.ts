import { Logger, Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { SeederService } from './seeder.service';

@Module({
    imports: [MessageModule],
    providers: [SeederService, Logger]
})
export class SeederModule {}
