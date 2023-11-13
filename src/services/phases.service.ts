import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePhaseInput, UpdatePhaseInput } from '../dto/phase.dto';
import { PhaseModel } from '../models/phase.model';
import { TaskModel } from '../models/task.model';
import { GraphQLError } from 'graphql';
import { ErrorCode } from '../shared/error-codes.enum';

export class PhasesService {
  private phaseModel: PhaseModel;

  private taskModel: TaskModel;

  public constructor() {
    this.phaseModel = PhaseModel.getInstance();
    this.taskModel = TaskModel.getInstance();
  }

  public async create(input: CreatePhaseInput) {
    input = plainToInstance(CreatePhaseInput, input);
    await this.validateInput(input);
    return this.phaseModel.create(input);
  }

  private async validateInput(input: CreatePhaseInput) {
    const errors = await validate(input);
    if (errors.length) {
      throw new GraphQLError('Invalid input data', {
        extensions: {
          invalidArgs: errors,
          code: ErrorCode.BAD_REQUEST
        }
      });
    }

    if (input.order && !this.phaseModel.isOrderUnique(input.order)) {
      throw new GraphQLError('Order must be unique', {
        extensions: {
          code: ErrorCode.ORDER_NOT_UNIQUE
        }
      });
    }
  }

  public getOne(id: string) {
    const phase = this.phaseModel.get(id);
    if (!phase) {
      throw new GraphQLError('Phase not found', {
        extensions: {
          code: ErrorCode.NOT_FOUND
        }
      });
    }
    return phase;
  }

  public async update(input: UpdatePhaseInput) {
    input = plainToInstance(UpdatePhaseInput, input);
    await this.validateInput(input);

    const phase = this.getOne(input.id);

    const data = { ...phase, ...input } as PhaseModel;
    this.phaseModel.update(input.id, data);

    return data;
  }

  public delete(id: string) {
    const tasks = this.taskModel.getAllByPhaseId(id);
    tasks.forEach((task) => this.taskModel.delete(task.id));

    this.phaseModel.delete(id);
  }

  public getAll() {
    return this.phaseModel.getAllOrderedByOrder();
  }

  public isPhaseDone(phaseId: string) {
    const tasks = this.taskModel.getAllByPhaseId(phaseId);
    if (!tasks?.length) {
      return false;
    }
    return tasks.every((task) => task.isDone);
  }

  public isAtLeastOneItemOfPhaseDone(phaseId: string) {
    const tasks = this.taskModel.getAllByPhaseId(phaseId);
    if (!tasks?.length) {
      return false;
    }
    return tasks.some((task) => task.isDone);
  }

  public getPreviousAndNextPhases(phaseId: string) {
    const phases = this.phaseModel.getAllOrderedByOrder();

    const currentPhaseIndex = phases.findIndex((phase) => phase.id === phaseId);

    const previousPhase = phases[currentPhaseIndex - 1];
    const nextPhase = phases[currentPhaseIndex + 1];

    return { previousPhase, nextPhase };
  }
}
