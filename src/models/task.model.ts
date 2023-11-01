import { TaskDTO } from '../dto/task.dto';
import { Model } from './model';

export class TaskModel extends Model<TaskDTO> {
  private static instance: TaskModel | null = null;

  private isDone: boolean = false;

  private phaseId: string = '';

  private constructor() {
    super();
  }

  public static getInstance(): TaskModel {
    if (!TaskModel.instance) {
      TaskModel.instance = new TaskModel();
    }
    return TaskModel.instance;
  }

  public setStatus(done: boolean) {
    this.isDone = done;
  }

  public setPhaseId(phaseId: string) {
    this.phaseId = phaseId;
  }
}
