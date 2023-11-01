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
    this.validateStatusChange(phase.id, input);

    return this.taskModel.create({ ...input, phaseId: phase.id });
  }

  private validateStatusChange(phaseId: string, input: TaskDTO) {
    const { previousPhase, nextPhase } = this.phasesService.getPreviousAndNextPhases(phaseId);

    // Trying to set a task to done when the previous phase is not completed
    if (input.isDone && previousPhase && !this.phasesService.isPhaseDone(previousPhase.id)) {
      throw new Error('Tasks from the previous phase are not completed');
    }

    // Trying to undo a task in the current phase when the next phase is already completed
    if (!input.isDone && nextPhase && this.phasesService.isPhaseDone(nextPhase.id)) {
      throw new Error('Tasks from the next phase are already completed');
    }
  }

  public find(id: string) {
    const task = this.taskModel.find(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  public update(id: string, input: TaskDTO) {
    const task = this.find(id);
    this.validateStatusChange(task.phaseId, input);

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
