import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePhaseInput, UpdatePhaseInput } from '../dto/phase.dto';
import { PhaseModel } from '../models/phase.model';
import { TaskModel } from '../models/task.model';
import { UserInputError, ApolloError } from 'apollo-server-errors';

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
      throw new UserInputError('Invalid input data', {
        invalidArgs: errors
      });
    }

    if (input.order && !this.phaseModel.isOrderUnique(input.order)) {
      throw new UserInputError('Order must be unique');
    }
  }

  public find(id: string) {
    const phase = this.phaseModel.find(id);
    if (!phase) {
      throw new ApolloError('Phase not found', 'NOT_FOUND');
    }
    return phase;
  }

  public async update(input: UpdatePhaseInput) {
    input = plainToInstance(UpdatePhaseInput, input);
    await this.validateInput(input);

    const phase = this.find(input.id);

    const data = { ...phase, ...input } as PhaseModel;
    this.phaseModel.update(input.id, data);

    return data;
  }

  public delete(id: string) {
    const tasks = this.taskModel.findAllByPhaseId(id);
    tasks.forEach((task) => this.taskModel.delete(task.id));

    this.phaseModel.delete(id);
  }

  public findAll() {
    return this.phaseModel.getAllOrderedByOrder();
  }

  public isPhaseDone(phaseId: string) {
    const tasks = this.taskModel.findAllByPhaseId(phaseId);
    if (!tasks?.length) {
      return false;
    }
    return tasks.every((task) => task.isDone);
  }

  public isAtLeastOneItemOfPhaseDone(phaseId: string) {
    const tasks = this.taskModel.findAllByPhaseId(phaseId);
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
