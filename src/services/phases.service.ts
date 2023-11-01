import { PhaseDTO } from '../dto/phase.dto';
import { PhaseModel } from '../models/phase.model';

export class PhasesService {
  private phaseModel: PhaseModel;

  public constructor() {
    this.phaseModel = PhaseModel.getInstance();
  }

  public create(input: PhaseDTO) {
    if (!this.phaseModel.isOrderUnique(input.order)) {
      throw new Error('Order must be unique');
    }

    return this.phaseModel.create(input);
  }

  public find(id: string) {
    const phase = this.phaseModel.find(id);
    if (!phase) {
      throw new Error('Phase not found');
    }
    return phase;
  }

  public update(id: string, input: PhaseDTO) {
    const phase = this.phaseModel.find(id);
    if (!phase) {
      throw new Error('Phase not found');
    }

    const data = { ...phase, ...input } as PhaseModel;
    this.phaseModel.update(id, data);

    return data;
  }

  public delete(id: string) {
    this.phaseModel.delete(id);
  }

  public findAll() {
    return this.phaseModel.findAll();
  }

  // TODO: Method to check if the phase is done (all tasks are done)
}
