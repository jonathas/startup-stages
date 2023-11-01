import { Model } from './model';

export class TaskModel extends Model<TaskModel> {
  private static instance: TaskModel | null = null;

  public isDone: boolean = false;

  public phaseId: string = '';

  private constructor() {
    super();
  }

  public static getInstance(): TaskModel {
    if (!TaskModel.instance) {
      TaskModel.instance = new TaskModel();
    }
    return TaskModel.instance;
  }
}
