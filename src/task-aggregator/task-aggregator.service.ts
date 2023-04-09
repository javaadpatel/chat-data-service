import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Observable, Subject } from "rxjs";

@Injectable()
export class TaskAggregatorService {
    private logger = new Logger(TaskAggregatorService.name);
    private taskResultMap = new Map<string, Subject<{}>>();
    private queuedTasks = 0;
    private totalTasksExecuted = 0;
    private retries = 3;
    private retryDelayInMilliseconds = 0;

    async runTaskObservable<T>(task: () => Promise<T>, eventName: string) : 
    Promise<Observable<{}>>{

        if (this.getTaskResult(eventName) !== undefined){
            this.queuedTasks++;
            // this.logger.log(`task is currently executing, skip reexecuting. Currently ${this.queuedTasks} tasks`);
            return;
        }

        //reset queuedTasks
        this.queuedTasks = 0;

        // If no task is running, create a new observable to emit the task result
        const taskResult$ = new Subject<T>();
        this.taskResultMap.set(eventName, taskResult$);
        this.logger.log(`created subject with eventName: ${eventName}`)

        // Your task code here
        this.retryTask(task(), this.retries, this.retryDelayInMilliseconds)
        .then((result: T) => {
            taskResult$.next(result);
            taskResult$.complete();
            this.logger.log(`total tasks executed: ${++this.totalTasksExecuted}`);
        })
        .catch((err) => {
            taskResult$.error(err);
        })
        .finally(() => {
            this.logger.log(`removing subject with eventName: ${eventName}`)
            this.taskResultMap.delete(eventName);
        });
    }

    private retryTask<T>(task: Promise<T>, retries: number, delayInMilliseconds: number) {
        return new Promise((resolve, reject) => {
          task
            .then(resolve)
            .catch((error) => {
              if (retries === 0){
                reject(error);
              } else {
                setTimeout(() => {
                    this.retryTask(task, retries - 1, delayInMilliseconds)
                        .then(resolve)
                        .catch(reject)
                }, delayInMilliseconds);
              }
            })
        })
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