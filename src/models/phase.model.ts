import { PhaseDTO } from '../dto/phase.dto';
import { Model } from './model';

export class PhaseModel extends Model<PhaseDTO> {
  public constructor() {
    super();
  }

  public isOrderUnique(order: number) {
    return Array.from(this.collection.values()).every(
      (existingPhase) => existingPhase.order !== order
    );
  }
}
