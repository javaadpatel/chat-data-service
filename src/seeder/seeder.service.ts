import { Injectable, Logger } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class SeederService {
    private _logger = new Logger('SeederService');

    constructor(
        private messageService: MessageService
    ) {}

    async seed(){
        await this.seedMessages();
    }
    
    private async seedMessages(){
        if ((await this.messageService.getMessages(1)).length == 0 ){
            this._logger.debug("seeding messages");

            for (var i = 0; i < 100; i++){
                const channelId = (i/10) + 1;
                await this.messageService.createMessage({channelId: channelId, authorId: 1, content: "content"});
            }

        }
    }

}