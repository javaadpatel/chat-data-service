import { HttpException, HttpStatus, Injectable, Logger, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "./message.entity";
import { Repository } from "typeorm";
import { CreateMessageRequestDto } from "./dto/create-message-request.dto";
import { TaskAggregatorService } from "src/task-aggregator/task-aggregator.service";

@Injectable({
  scope: Scope.DEFAULT
})
export class MessageService {
  private logger = new Logger(MessageService.name)
  private totalMessagesServed = 0;
  private totalCoalescedMessagesServed = 0;
  private delayInMs: number = 3000;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly taskAggregator: TaskAggregatorService,
  ) { }

  async createMessage(createMessageDto: CreateMessageRequestDto): Promise<void> {
    const newMessage = this.messageRepo.create(createMessageDto);
    await newMessage.save();
  }

  async getMessages(channelId: number): Promise<Message[]> {
    await this.delay(this.delayInMs);

    const messages = await this.messageRepo.createQueryBuilder('message')
      .where('message.channelId = :channelId', { channelId })
      .getMany();
    this.logger.log(`total messages served: ${++this.totalMessagesServed}`);
    return messages;
  }

  async getMessagesCoalesced(channelId: number): Promise<{}> {
    const eventName = `getMessages-${channelId}`;

    await this.taskAggregator.runTaskObservable<Message[]>(async () => {
      const messages = await this.messageRepo.createQueryBuilder('message')
        .where('message.channelId = :channelId', { channelId })
        .getMany();

      await this.delay(this.delayInMs);
      return messages;
    }, eventName);

    const taskResult$ = this.taskAggregator.getTaskResultObservable(eventName);

    // Wait for the task to complete and return the result as an API response
    return Promise.race([this.createTimeout(5000), taskResult$.toPromise().then((result) => {
        this.logger.log(`total messages served: ${++this.totalCoalescedMessagesServed}`);
        return result;
      })]);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  private createTimeout(timeoutInMilliseconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject('Task timeout expired');
      }, timeoutInMilliseconds);
    });
  }

}