import { validate } from 'class-validator';
import { TaskModel } from '../models/task.model';
import { PhasesService } from './phases.service';
import { Helpers } from '../helpers/helpers';
import { CreateTaskInput, TaskDTO, UpdateTaskInput } from '../dto/task.dto';

export class TasksService {
  private taskModel: TaskModel;

  private phasesService: PhasesService;

  public constructor() {
    this.taskModel = TaskModel.getInstance();
    this.phasesService = new PhasesService();
  }

  public async create(input: CreateTaskInput) {
    if (!input.phaseId) {
      throw new Error('PhaseId is required');
    }
    const phase = this.phasesService.find(input.phaseId);
    await this.validateInput(phase.id, input);

    return this.taskModel.create({ ...input, phaseId: phase.id });
  }

  private async validateInput(phaseId: string, input: TaskDTO) {
    const validation = await validate(input);
    if (validation.length) {
      throw new Error(`Validation failed. Errors: ${JSON.stringify(validation)}`);
    }

    this.validateStatusChange(phaseId, input);
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

  public async update(input: UpdateTaskInput) {
    const task = this.find(input.id);
    await this.validateInput(task.phaseId, input);

    const newValues = Helpers.getOnlyDefinedValues(input);

    const data = { ...task, ...newValues } as TaskModel;
    this.taskModel.update(input.id, data);

    return data;
  }

  public delete(id: string) {
    this.taskModel.delete(id);
  }

  public findAll() {
    return this.taskModel.findAll();
  }
}
