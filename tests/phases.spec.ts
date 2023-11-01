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
  let createdPhase: { id: string } & PhaseDTO;

  beforeEach(() => {
    phasesService = new PhasesService();
  });

  afterEach(() => {
    phasesService.delete(createdPhase.id);
  });

  it('should be possible to create a phase', () => {
    createdPhase = phasesService.create(phase);

    expect(createdPhase.id).not.toBeUndefined();
    expect(createdPhase.order).toBe(1);
    expect(createdPhase.title).toBe('Foundation');
  });

  it('should not be possible to create a phase with the same order', () => {
    createdPhase = phasesService.create(phase);

    expect(() => phasesService.create(phase)).toThrow('Order must be unique');
  });

  it('should be possible to find a phase', () => {
    createdPhase = phasesService.create(phase);
    const found = phasesService.find(createdPhase.id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(createdPhase.id);
    expect(found.order).toBe(1);
    expect(found.title).toBe('Foundation');
  });

  it('should be possible to update a phase', () => {
    createdPhase = phasesService.create(phase);
    const updated = phasesService.update(createdPhase.id, newPhase);

    expect(updated).not.toBeUndefined();
    expect(updated.order).toBe(2);
    expect(updated.title).toBe('Discovery');
  });

  it('should not be possible to update a phase if it does not exist', () => {
    expect(() => phasesService.update('this-id-doesnt-exist', newPhase)).toThrow('Phase not found');
  });

  it('should be possible to find all phases', () => {
    createdPhase = phasesService.create(phase);
    const phase2 = phasesService.create(newPhase);

    expect(phasesService.findAll().size).toBe(2);

    phasesService.delete(phase2.id);
  });

  it('should be possible to delete a phase', () => {
    const res = phasesService.create(phase);
    phasesService.delete(res.id);

    expect(phasesService.findAll().size).toBe(0);
  });
});
