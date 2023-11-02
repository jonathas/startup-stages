/* eslint-disable max-lines-per-function */
import { PhaseDTO } from '../src/dto/phase.dto';
import { PhaseModel } from '../src/models/phase.model';
import { PhasesService } from '../src/services/phases.service';
import { TasksService } from '../src/services/tasks.service';

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
  let createdPhase: PhaseModel;

  beforeEach(() => {
    phasesService = new PhasesService();
  });

  afterEach(() => {
    phasesService.delete(createdPhase.id);
  });

  it('should be possible to create a phase', async () => {
    createdPhase = await phasesService.create(phase);

    expect(createdPhase.id).not.toBeUndefined();
    expect(createdPhase.order).toBe(1);
    expect(createdPhase.title).toBe('Foundation');
  });

  it('should not be possible to create a phase with the same order', async () => {
    createdPhase = await phasesService.create(phase);

    await expect(() => phasesService.create(phase)).rejects.toThrow('Order must be unique');
  });

  it('should be possible to find a phase', async () => {
    createdPhase = await phasesService.create(phase);
    const found = phasesService.find(createdPhase.id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(createdPhase.id);
    expect(found.order).toBe(1);
    expect(found.title).toBe('Foundation');
  });

  it('should be possible to update a phase', async () => {
    createdPhase = await phasesService.create(phase);
    const updated = await phasesService.update({ ...newPhase, id: createdPhase.id });

    expect(updated).not.toBeUndefined();
    expect(updated.order).toBe(2);
    expect(updated.title).toBe('Discovery');
  });

  it('should not be possible to update a phase if it does not exist', async () => {
    await expect(() =>
      phasesService.update({ ...newPhase, id: 'this-id-doesnt-exist' })
    ).rejects.toThrow('Phase not found');
  });

  it('should be possible to find all phases', async () => {
    createdPhase = await phasesService.create(phase);
    const phase2 = await phasesService.create(newPhase);

    expect(phasesService.findAll().length).toBe(2);

    phasesService.delete(phase2.id);
  });

  it('should be possible to delete a phase', async () => {
    const res = await phasesService.create(phase);
    phasesService.delete(res.id);

    expect(phasesService.findAll().length).toBe(0);
  });

  it('should be considered as done when all tasks are done', async () => {
    createdPhase = await phasesService.create(phase);
    const task = {
      title: 'Setup virtual office',
      isDone: true,
      phaseId: createdPhase.id
    };
    const task2 = {
      title: 'Set mission & vision',
      isDone: true,
      phaseId: createdPhase.id
    };

    const tasksService = new TasksService();

    const taskModel = await tasksService.create(task);
    const taskModel2 = await tasksService.create(task2);

    expect(phasesService.isPhaseDone(createdPhase.id)).toBe(true);

    tasksService.delete(taskModel.id);
    tasksService.delete(taskModel2.id);
  });

  it('should delete all tasks when a phase is deleted', async () => {
    createdPhase = await phasesService.create(phase);
    const task = {
      title: 'Setup virtual office',
      isDone: true,
      phaseId: createdPhase.id
    };
    const task2 = {
      title: 'Set mission & vision',
      isDone: true,
      phaseId: createdPhase.id
    };

    const tasksService = new TasksService();

    const taskModel = await tasksService.create(task);
    const taskModel2 = await tasksService.create(task2);

    phasesService.delete(createdPhase.id);

    expect(tasksService.findAll().length).toBe(0);

    tasksService.delete(taskModel.id);
    tasksService.delete(taskModel2.id);
  });

  it('should be possible to get the next and previous phases', async () => {
    const phase2 = {
      order: 2,
      title: 'Discovery'
    };
    const phase3 = {
      order: 3,
      title: 'Delivery'
    };

    createdPhase = await phasesService.create(phase);
    const createdPhase2 = await phasesService.create(phase2);
    const createdPhase3 = await phasesService.create(phase3);

    const { nextPhase, previousPhase } = phasesService.getPreviousAndNextPhases(createdPhase2.id);

    expect(nextPhase).not.toBeUndefined();
    expect(nextPhase.id).toBe(createdPhase3.id);
    expect(previousPhase).not.toBeUndefined();
    expect(previousPhase.id).toBe(createdPhase.id);

    phasesService.delete(createdPhase2.id);
    phasesService.delete(createdPhase3.id);
  });

  it('should return undefined for the next phase if there is no next phase', async () => {
    createdPhase = await phasesService.create(phase);
    const { nextPhase } = phasesService.getPreviousAndNextPhases(createdPhase.id);

    expect(nextPhase).toBeUndefined();
  });
});
