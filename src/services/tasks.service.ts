import { TaskDTO } from '../dto/task.dto';
import { TaskModel } from '../models/task.model';
import { PhasesService } from './phases.service';

export class TasksService {
  private taskModel: TaskModel;

  private phasesService: PhasesService;

  public constructor() {
    this.taskModel = TaskModel.getInstance();
    this.phasesService = new PhasesService();
  }

  public create(input: TaskDTO) {
    const phase = this.phasesService.find(input.phaseId);
    return this.taskModel.create({ ...input, phaseId: phase.id });
  }

  public find(id: string) {
    const task = this.taskModel.find(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  public update(id: string, input: TaskDTO) {
    const task = this.taskModel.find(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const data = { ...task, ...input } as TaskModel;
    this.taskModel.update(id, data);

    return data;
  }

  public delete(id: string) {
    this.taskModel.delete(id);
  }

  public findAll() {
    return this.taskModel.findAll();
  }
}
