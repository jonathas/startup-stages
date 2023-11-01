import { Model } from './model';

export class TaskModel extends Model<TaskModel> {
  private isDone: boolean = false;

  public constructor() {
    super();
  }

  public setStatus(done: boolean) {
    this.isDone = done;
  }
}
