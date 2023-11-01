import { Model } from './model';

export class PhaseModel extends Model<PhaseModel> {
  private static instance: PhaseModel | null = null;

  public order: number = 0;

  private constructor() {
    super();
  }

  public static getInstance(): PhaseModel {
    if (!PhaseModel.instance) {
      PhaseModel.instance = new PhaseModel();
    }
    return PhaseModel.instance;
  }

  public isOrderUnique(order: number) {
    return Array.from(this.collection.values()).every(
      (existingPhase) => existingPhase.order !== order
    );
  }

  public getAllOrderedByOrder() {
    return Array.from(this.collection.values()).sort((a, b) => a.order - b.order);
  }
}
