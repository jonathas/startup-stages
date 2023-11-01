/* eslint-disable max-lines-per-function */
import { PhaseDTO } from '../src/dto/phase.dto';
import { TaskDTO } from '../src/dto/task.dto';
import { PhaseModel } from '../src/models/phase.model';
import { TaskModel } from '../src/models/task.model';
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
  const newTask: Partial<TaskDTO> = {
    title: 'Setup virtual office today',
    isDone: true
  };

  let phasesService: PhasesService;
  let tasksService: TasksService;
  let createdPhase: PhaseModel;
  let createdTask: TaskModel;

  beforeEach(() => {
    phasesService = new PhasesService();
    tasksService = new TasksService();
  });

  afterEach(() => {
    phasesService.delete(createdPhase.id);
    tasksService.delete(createdTask.id);
  });

  it('should be possible to create a task', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    createdTask = tasksService.create(task as TaskDTO);

    expect(createdTask.id).not.toBeUndefined();
    expect(createdTask.title).toBe('Setup virtual office');
    expect(createdTask.isDone).toBe(false);
    expect(createdTask.phaseId).toBe(createdPhase.id);
  });

  it('should not be possible to create a task without a phase', () => {
    expect(() => tasksService.create(task as TaskDTO)).toThrow('Phase not found');
  });

  it('should be possible to find a task', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    createdTask = tasksService.create(task as TaskDTO);
    const found = tasksService.find(createdTask.id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(createdTask.id);
    expect(found.title).toBe('Setup virtual office');
    expect(found.isDone).toBe(false);
    expect(found.phaseId).toBe(createdPhase.id);
  });

  it('should be possible to update a task', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    createdTask = tasksService.create(task as TaskDTO);
    const updated = tasksService.update(createdTask.id, newTask as TaskDTO);

    expect(updated).not.toBeUndefined();
    expect(updated.id).toBe(createdTask.id);
    expect(updated.title).toBe('Setup virtual office today');
    expect(updated.isDone).toBe(true);
    expect(updated.phaseId).toBe(createdPhase.id);
  });

  it('should not be possible to update a task if it does not exist', () => {
    expect(() => tasksService.update('123', newTask as TaskDTO)).toThrow('Task not found');
  });

  it('should be possible to find all tasks', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    createdTask = tasksService.create(task as TaskDTO);
    const secondTask = tasksService.create({ ...newTask, phaseId: createdPhase.id } as TaskDTO);
    const found = tasksService.findAll();

    expect(found).not.toBeUndefined();
    expect(found).toHaveLength(2);
    expect(found[0].id).toBe(createdTask.id);
    expect(found[0].title).toBe('Setup virtual office');
    expect(found[0].isDone).toBe(false);
    expect(found[0].phaseId).toBe(createdPhase.id);

    tasksService.delete(secondTask.id);
  });

  it('should be possible to delete a task', () => {
    createdPhase = phasesService.create(phase);
    task.phaseId = createdPhase.id;

    const res = tasksService.create(task as TaskDTO);
    tasksService.delete(res.id);

    expect(() => tasksService.find(res.id)).toThrow('Task not found');
  });

  /*
    it.skip('should not complete a task if all tasks in the previous 
    phase are not completed', () => {});
  */
});
