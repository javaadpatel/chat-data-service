import { Body, Controller, Get, Logger, Post, Query, Req, Res, Scope, UseInterceptors } from "@nestjs/common";
import { MessageService } from "./message.service";
import { CreateMessageRequestDto } from "./dto/create-message-request.dto";
import { Worker } from "worker_threads";
import { Request, Response } from "express";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Controller({path: 'messages'})
export class MessageController {
    private logger = new Logger(MessageController.name);

    constructor (
        private readonly messageService : MessageService,
        private readonly httpService: HttpService
    ){
        console.log("creating new controlelr instances")
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

    async delay(ms: number): Promise<void> { 
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

    @Get('concurrent')
    getMessagesConcurrent () : Promise<void>{
        // this.logger.log('executing concurrent request');
        console.log("executing concurrent request")
        return new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 10000);
          });
    }

    @Get('concurrent-api')
    async getConcurrentApi () {
        console.log("calling api")
        const apiUrl = "https://hub.dummyapis.com/delay?seconds=10";
        await firstValueFrom(this.httpService.get(apiUrl));
        console.log("done")
    }

    @Get('concurrent-worker')
    async getMessagesConcurrentWorker (@Req() req: Request, @Res() res: Response) : Promise<void>{
        // this.logger.log('executing concurrent request');
        console.log("executing concurrent request");
        // console.log({req});
        // console.log({res});

        await this.handleRequest(req, res);
    }

    @Get('concurrent2')
    getMessagesConcurrent2 () : Promise<void>{
        this.logger.log('executing concurrent request');
        return new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 10000);
          });
    }

    @Post()
    createMessage(@Body() createMesageDto: CreateMessageRequestDto){
        this.logger.log(createMesageDto);
        return this.messageService.createMessage(createMesageDto);
    }

    async handleRequest(req, res) {
        console.log("creating worker");
        // const worker = new Worker('./src/message/worker.js', { workerData: { req, res } });
        const worker = new Worker('./src/message/worker.js', { workerData: { } });

        console.log("created worker");
      
        worker.on('message', (result) => {
            console.log("message recieved from worker")
          res.send(result);
        });
      
        worker.on('error', (err) => {
          console.error(err);
          res.status(500).send('An error occurred');
        });
      
        worker.on('exit', (code) => {
          if (code !== 0) {
            console.error(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      }

}