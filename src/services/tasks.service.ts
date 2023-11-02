import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { TaskModel } from '../models/task.model';
import { PhasesService } from './phases.service';
import { CreateTaskInput, UpdateTaskInput } from '../dto/task.dto';
import { GraphQLError } from 'graphql';

export class TasksService {
  private taskModel: TaskModel;

  private phasesService: PhasesService;

  public constructor() {
    this.taskModel = TaskModel.getInstance();
    this.phasesService = new PhasesService();
  }

  public async create(input: CreateTaskInput) {
    input = plainToInstance(CreateTaskInput, input);
    const phase = this.phasesService.find(input.phaseId);
    await this.validateInput(phase.id, input);

    return this.taskModel.create({ ...input, phaseId: phase.id });
  }

  private async validateInput(phaseId: string, input: CreateTaskInput | UpdateTaskInput) {
    const errors = await validate(input);
    if (errors.length) {
      throw new GraphQLError('Invalid input data', {
        extensions: { invalidArgs: errors, code: 'BAD_REQUEST' }
      });
    }

    this.validateStatusChange(phaseId, input);
  }

  private validateStatusChange(phaseId: string, input: CreateTaskInput | UpdateTaskInput) {
    const { previousPhase, nextPhase } = this.phasesService.getPreviousAndNextPhases(phaseId);

    // Trying to set a task to done when the previous phase is not completed
    if (input.isDone && previousPhase && !this.phasesService.isPhaseDone(previousPhase.id)) {
      throw new GraphQLError('Tasks from the previous phase are not completed', {
        extensions: {
          code: 'PREVIOUS_PHASE_NOT_COMPLETED'
        }
      });
    }

    // Trying to undo a task in the current phase when any task of next phase is already completed
    if (
      !input.isDone &&
      nextPhase &&
      this.phasesService.isAtLeastOneItemOfPhaseDone(nextPhase.id)
    ) {
      throw new GraphQLError(
        `At least one task from the next phase is already completed, ` +
          `so this task cannot be updated to not done`,
        {
          extensions: {
            code: 'NEXT_PHASE_DONE'
          }
        }
      );
    }
  }

  public find(id: string) {
    const task = this.taskModel.find(id);
    if (!task) {
      throw new GraphQLError('Task not found', {
        extensions: {
          code: 'NOT_FOUND'
        }
      });
    }
    return task;
  }

  public async update(input: UpdateTaskInput) {
    input = plainToInstance(UpdateTaskInput, input);
    const task = this.find(input.id);
    await this.validateInput(task.phaseId, input);

    const data = { ...task, ...input } as TaskModel;
    this.taskModel.update(input.id, data);

    return data;
  }

  public delete(id: string) {
    this.taskModel.delete(id);
  }

  public findAll() {
    return this.taskModel.findAll();
  }

  public findAllByPhaseId(phaseId: string) {
    return this.taskModel.findAllByPhaseId(phaseId);
  }
}
