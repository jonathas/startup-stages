import { PhaseDTO } from '../dto/phase.dto';
import { Model } from './model';

export class PhaseModel extends Model<PhaseDTO> {
  private static instance: PhaseModel | null = null;

  private order: number = 0;

  private constructor() {
    super();
  }

  public static getInstance(): PhaseModel {
    if (!PhaseModel.instance) {
      PhaseModel.instance = new PhaseModel();
    }
    return PhaseModel.instance;
  }

  public setOrder(order: number) {
    this.order = order;
  }

  public isOrderUnique(order: number) {
    return Array.from(this.collection.values()).every(
      (existingPhase) => existingPhase.order !== order
    );
  }
}
