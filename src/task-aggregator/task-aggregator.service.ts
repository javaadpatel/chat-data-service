import { Injectable, Logger, Scope } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Observable, Subject, share } from "rxjs";
import { Message } from "src/message/message.entity";


@Injectable()
export class TaskAggregatorService {
    private logger = new Logger(TaskAggregatorService.name);
    private taskResultMap = new Map<string, Subject<{}>>();

    constructor(private readonly eventEmitter: EventEmitter2){}

    async runTask<T>(task: () => Promise<T>, eventName: string) : Promise<void>{
        //perform aggregation here
        if (this.getTaskResult(eventName) !== undefined){
            this.logger.log("task is currently executing, skip reexecuting");
            return;
        }

        //register task
        const taskResult$ = new Subject<T>();
        this.taskResultMap.set(eventName, taskResult$);

        //execute task
        const result = await task();
        this.logger.log(`executed task, result was: ${JSON.stringify(result)}`)

        //emit task
        taskResult$.next(result);
        taskResult$.complete();

        //remove task
        this.logger.log(`removing subject with eventName: ${eventName}`)
        this.taskResultMap.delete(eventName);
    }

    private runningTask$?: Observable<{}>;

    async runTaskObservable<T>(task: () => Promise<T>, eventName: string) : 
    Promise<Observable<{}>>{

          if (this.getTaskResult(eventName) !== undefined){
            this.logger.log("task is currently executing, skip reexecuting");
            return;
        }

        // If no task is running, create a new observable to emit the task result
        const taskResult$ = new Subject<T>();
        this.taskResultMap.set(eventName, taskResult$);
        this.logger.log("created subject")

        // Your task code here
        task().then((result) => {
            taskResult$.next(result);
            taskResult$.complete();
            this.logger.log(`removing subject with eventName: ${eventName}`)
            this.taskResultMap.delete(eventName);
        });
      


                  //execute task
        // const result = await task();
        // this.logger.log(`executed task, result was: ${JSON.stringify(result)}`)

        //emit task
        // taskResult$.next(result);
        // taskResult$.complete();

    }

    async runTaskEvent<T>(task: () => Promise<T>, eventName: string) : 
    Promise<void>{
         //execute task
        const result = await task();
        this.logger.log(`executed task, result was: ${JSON.stringify(result)}`)

        //emit task
        this.eventEmitter.emit(eventName, result);
    }

    getTaskResult(eventName: string) : Subject<{}>{
        return this.taskResultMap.get(eventName);
    }

    getTaskResultObservable(eventName: string) : Observable<{}>{
        return this.taskResultMap.get(eventName).asObservable();
    }

    deleteTaskResult(eventName: string): void {
        this.taskResultMap.delete(eventName);
    }
}