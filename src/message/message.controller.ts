import { Body, Controller, Get, Logger, Post, Query, Req, Res, Scope, UseInterceptors } from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageRequestDto } from "./dto/create-message-request.dto";

@Controller({path: 'messages'})
export class MessageController {
    private logger = new Logger(MessageController.name);

    constructor (
        private readonly messageService : MessageService
    ){
    }

    @Get()
    getMessages(@Query() query: { channelId: number }){
        this.logger.log(`getting messages for channelId: ${query.channelId}`)
        return this.messageService.getMessages(query.channelId);
    }

    @Get('coalesced')
    getMessagesCoalesced (@Query() query: {channelId: number}){
        return this.messageService.getMessagesCoalesced(query.channelId);
    }

    @Post()
    createMessage(@Body() createMesageDto: CreateMessageRequestDto){
        this.logger.log(createMesageDto);
        return this.messageService.createMessage(createMesageDto);
    }
}