/* eslint-disable max-lines-per-function */
import { PhaseDTO } from '../src/dto/phase.dto';
import { PhasesService } from '../src/services/phases.service';

describe('# Phases', () => {
  const phase: PhaseDTO = {
    order: 1,
    title: 'Foundation'
  };
  const newPhase: PhaseDTO = {
    order: 2,
    title: 'Discovery'
  };

  let phasesService: PhasesService;

  beforeEach(() => {
    phasesService = new PhasesService();
  });

  it('should be possible to create a phase', () => {
    const res = phasesService.create(phase);

    expect(res.id).not.toBeUndefined();
    expect(res.order).toBe(1);
    expect(res.title).toBe('Foundation');
  });

  it('should not be possible to create a phase with the same order', () => {
    phasesService.create(phase);

    expect(() => phasesService.create(phase)).toThrow('Order must be unique');
  });

  it('should be possible to find a phase', () => {
    const res = phasesService.create(phase);
    const found = phasesService.find(res.id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(res.id);
    expect(found.order).toBe(1);
    expect(found.title).toBe('Foundation');
  });

  it('should be possible to update a phase', () => {
    const res = phasesService.create(phase);
    const updated = phasesService.update(res.id, newPhase);

    expect(updated).not.toBeUndefined();
    expect(updated.order).toBe(2);
    expect(updated.title).toBe('Discovery');
  });

  it('should not be able to update a phase if it does not exist', () => {
    expect(() => phasesService.update('this-id-doesnt-exist', newPhase)).toThrow('Phase not found');
  });

  it('should be possible to find all phases', () => {
    phasesService.create(phase);
    phasesService.create(newPhase);

    expect(phasesService.findAll().size).toBe(2);
  });

  it('should be possible to delete a phase', () => {
    const res = phasesService.create(phase);
    phasesService.delete(res.id);

    expect(phasesService.findAll().size).toBe(0);
  });
});
