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
        this.logger.log("Getting coalesced messages");
        const eventName = 'getMessages';
        const ob = await this.taskAggregator.runTaskObservable<Message[]>(async () => {
            const messages = await this.messageRepo.createQueryBuilder('message')
             .where('message.channelId = :channelId', { channelId })
            .getMany();

            await this.delay(5000);
            return messages;
        }, eventName);

        // return new Promise(async (resolve) => {
        //     ob.subscribe(() => {
        //     this.logger.log("con")
        //     // this.taskAggregator.deleteTaskResult(eventName);
        //     resolve(null);
        //     // return null;
        // })});

        const taskResult$ = this.taskAggregator.getTaskResultObservable(eventName);
        this.logger.log(`retrieved taskResult: ${taskResult$}`);
        // this.logger.log(`task is observed: ${taskResult$.observed}`)
        // return new Promise((resolve) => {
        //     taskResult$.subscribe((taskResult) => {
        //         this.logger.log("subscription resolved");
        //         resolve(taskResult as Message[]);
        //     }) 
        // });

        // Wait for the task to complete and return the result as an API response
        return taskResult$.toPromise();
        // const result = await taskResult$.toPromise();
        // return result as Message[];

        // this.eventEmitter.on(eventName, (result: Message[]) => {
        //     // Your subscription code here 
        //     return result;
        //   });

        //   return new Promise((resolve) => {
        //     this.eventEmitter.on(eventName, (result: Message[]) => {
        //         // Your subscription code here 
        //         resolve(result);
        //       });
        // });
        
     }
    
}