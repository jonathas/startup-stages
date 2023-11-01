import { PhaseDTO } from '../src/dto/phase.dto';
import { TaskDTO } from '../src/dto/task.dto';
import { PhasesService } from '../src/services/phases.service';
import { TasksService } from '../src/services/tasks.service';

describe('# Tasks', () => {
  const phase: PhaseDTO = {
    order: 1,
    title: 'Foundation'
  };
  const task: Partial<TaskDTO> = {
    title: 'Setup virtual office',
    isDone: false
  };
  /*const newTask: Partial<TaskDTO> = {
    title: 'Setup virtual office today',
    isDone: true
  };*/

  let phasesService: PhasesService;
  let tasksService: TasksService;
  let createdPhase: { id: string } & PhaseDTO;

  beforeEach(() => {
    phasesService = new PhasesService();
    tasksService = new TasksService();
  });

  afterEach(() => {
    phasesService.delete(createdPhase.id);
  });

  it('should be possible to create a task', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    const res = tasksService.create(task as TaskDTO);

    expect(res.id).not.toBeUndefined();
    expect(res.title).toBe('Setup virtual office');
    expect(res.isDone).toBe(false);
    expect(res.phaseId).toBe(createdPhase.id);
  });

  it('should not be possible to create a task without a phase', () => {
    expect(() => tasksService.create(task as TaskDTO)).toThrow('Phase not found');
  });

  it.skip('should be possible to find a task', () => {});

  it.skip('should be possible to update a task', () => {});

  it.skip('should not be possible to update a task if it does not exist', () => {});

  it.skip('should be possible to find all tasks', () => {});

  it.skip('should be possible to delete a task', () => {});
});
