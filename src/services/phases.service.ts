import { validate } from 'class-validator';
import { PhaseDTO } from '../dto/phase.dto';
import { PhaseModel } from '../models/phase.model';
import { TaskModel } from '../models/task.model';

export class PhasesService {
  private phaseModel: PhaseModel;

  private taskModel: TaskModel;

  public constructor() {
    this.phaseModel = PhaseModel.getInstance();
    this.taskModel = TaskModel.getInstance();
  }

  public async create(input: PhaseDTO) {
    await this.validateInput(input);
    return this.phaseModel.create(input);
  }

  private async validateInput(input: PhaseDTO) {
    const validation = await validate(input);
    if (validation.length) {
      throw new Error(`Validation failed. Errors: ${JSON.stringify(validation)}`);
    }

    if (!this.phaseModel.isOrderUnique(input.order)) {
      throw new Error('Order must be unique');
    }
  }

  public find(id: string) {
    const phase = this.phaseModel.find(id);
    if (!phase) {
      throw new Error('Phase not found');
    }
    return phase;
  }

  public async update(id: string, input: PhaseDTO) {
    await this.validateInput(input);

    const phase = this.find(id);

    const data = { ...phase, ...input } as PhaseModel;
    this.phaseModel.update(id, data);

    return data;
  }

  public delete(id: string) {
    const tasks = this.taskModel.findAllByPhaseId(id);
    tasks.forEach((task) => this.taskModel.delete(task.id));

    this.phaseModel.delete(id);
  }

  public findAll() {
    return this.phaseModel.findAll();
  }

  public isPhaseDone(phaseId: string) {
    const tasks = this.taskModel.findAllByPhaseId(phaseId);
    return tasks.every((task) => task.isDone);
  }

  public getPreviousAndNextPhases(phaseId: string) {
    const phases = this.phaseModel.getAllOrderedByOrder();

    const currentPhaseIndex = phases.findIndex((phase) => phase.id === phaseId);

    const previousPhase = phases[currentPhaseIndex - 1];
    const nextPhase = phases[currentPhaseIndex + 1];

    return { previousPhase, nextPhase };
  }
}
