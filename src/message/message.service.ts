import { Injectable, Logger, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { Repository, getRepository } from "typeorm";
import { CreateMessageRequestDto } from "./dto/create-message-request.dto";
import { TaskAggregatorService } from "src/task-aggregator/task-aggregator.service";
import { EventEmitter2 } from "@nestjs/event-emitter";


@Injectable({
    scope: Scope.DEFAULT
})
export class MessageService {
    private logger = new Logger(MessageService.name)
    
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        private readonly taskAggregator: TaskAggregatorService,
        private readonly eventEmitter: EventEmitter2
    ){}

    async createMessage(createMessageDto: CreateMessageRequestDto) : Promise<void> {
        this.logger.log("creating message");
        const newMessage = this.messageRepo.create(createMessageDto);
        await newMessage.save();
        this.logger.log("created message");
    }

    async getMessages(channelId: number): Promise<Message[]>{
      await this.delay(2000);
       return await this.messageRepo.createQueryBuilder('message')
        .where('message.channelId = :channelId', { channelId })
        .getMany();
    }

    async delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
 

    async getMessagesCoalesced(channelId: number): Promise<{}>{
        const startTime = Date.now();
        const eventName = 'getMessages';
        await this.taskAggregator.runTaskObservable<Message[]>(async () => {
            const messages = await this.messageRepo.createQueryBuilder('message')
             .where('message.channelId = :channelId', { channelId })
            .getMany();

            await this.delay(5000);
            return messages;
        }, eventName);

        const taskResult$ = this.taskAggregator.getTaskResultObservable(eventName);

        // Wait for the task to complete and return the result as an API response
        return taskResult$.toPromise().then((result) => {
          const elapsedTime = Date.now() - startTime;
          this.logger.log(`response time: ${elapsedTime} ms`);
          return result;
        });        
     }
    
}