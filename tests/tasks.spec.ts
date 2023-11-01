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
  const secondPhase: PhaseDTO = {
    order: 2,
    title: 'Discovery'
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
  let createdPhases: PhaseModel[] = [];
  let createdTasks: TaskModel[] = [];

  beforeEach(() => {
    phasesService = new PhasesService();
    tasksService = new TasksService();
  });

  afterEach(() => {
    createdPhases.forEach((p) => phasesService.delete(p.id));
    createdTasks.forEach((t) => tasksService.delete(t.id));

    createdPhases = [];
    createdTasks = [];
  });

  it('should be possible to create a task', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create(task as TaskDTO));

    expect(createdTasks[0].id).not.toBeUndefined();
    expect(createdTasks[0].title).toBe('Setup virtual office');
    expect(createdTasks[0].isDone).toBe(false);
    expect(createdTasks[0].phaseId).toBe(createdPhases[0].id);
  });

  it('should not be possible to create a task without a phase', () => {
    expect(() => tasksService.create(task as TaskDTO)).toThrow('Phase not found');
  });

  it('should be possible to find a task', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create(task as TaskDTO));
    const found = tasksService.find(createdTasks[0].id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(createdTasks[0].id);
    expect(found.title).toBe('Setup virtual office');
    expect(found.isDone).toBe(false);
    expect(found.phaseId).toBe(createdPhases[0].id);
  });

  it('should be possible to update a task', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create(task as TaskDTO));
    const updated = tasksService.update(createdTasks[0].id, newTask as TaskDTO);

    expect(updated).not.toBeUndefined();
    expect(updated.id).toBe(createdTasks[0].id);
    expect(updated.title).toBe('Setup virtual office today');
    expect(updated.isDone).toBe(true);
    expect(updated.phaseId).toBe(createdPhases[0].id);
  });

  it('should not be possible to update a task if it does not exist', () => {
    expect(() => tasksService.update('123', newTask as TaskDTO)).toThrow('Task not found');
  });

  it('should be possible to find all tasks', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create(task as TaskDTO));
    const secondTask = tasksService.create({ ...newTask, phaseId: createdPhases[0].id } as TaskDTO);
    const found = tasksService.findAll();

    expect(found).not.toBeUndefined();
    expect(found).toHaveLength(2);
    expect(found[0].id).toBe(createdTasks[0].id);
    expect(found[0].title).toBe('Setup virtual office');
    expect(found[0].isDone).toBe(false);
    expect(found[0].phaseId).toBe(createdPhases[0].id);

    tasksService.delete(secondTask.id);
  });

  it('should be possible to delete a task', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    const res = tasksService.create(task as TaskDTO);
    tasksService.delete(res.id);

    expect(() => tasksService.find(res.id)).toThrow('Task not found');
  });

  it('should not complete a task if any task in the previous phase is not completed', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create(task as TaskDTO)); // isDone = false

    newTask.phaseId = createdPhases[0].id;
    createdTasks.push(tasksService.create(newTask as TaskDTO)); // isDone = true

    // Meaning that not all tasks in the Foundation phase are completed

    createdPhases.push(phasesService.create(secondPhase));

    /**
     * Third task cannot be created as done, since at least one of the tasks in the previous
     * phase is not done
     */
    expect(() =>
      tasksService.create({ ...newTask, phaseId: createdPhases[1].id } as TaskDTO)
    ).toThrow('Tasks from the previous phase are not completed');

    // If it is created as not done, it should work
    const res = tasksService.create({
      ...newTask,
      phaseId: createdPhases[1].id,
      isDone: false
    } as TaskDTO);

    expect(res).not.toBeUndefined();
    expect(res.id).not.toBeUndefined();
    expect(res.isDone).toBe(false);

    // But then if we try to update it as done, it should not work
    expect(() => tasksService.update(res.id, { ...newTask, isDone: true } as TaskDTO)).toThrow(
      'Tasks from the previous phase are not completed'
    );
  });

  it('should set a task to not done only if all tasks in the next phase are not done', () => {
    createdPhases.push(phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(tasksService.create({ ...task, isDone: true } as TaskDTO));

    newTask.phaseId = createdPhases[0].id;
    createdTasks.push(tasksService.create(newTask as TaskDTO)); // isDone = true

    // Meaning that all tasks in the Foundation phase are completed

    createdPhases.push(phasesService.create(secondPhase));

    // The first task in the second phase is also done
    const thirdTask = tasksService.create({
      ...newTask,
      phaseId: createdPhases[1].id,
      isDone: true
    } as TaskDTO);

    // If we try to set any task in the previous phase to not done, it should not work
    expect(() =>
      tasksService.update(createdTasks[1].id, { ...task, isDone: false } as TaskDTO)
    ).toThrow('Tasks from the next phase are already completed');

    // If we try to set any task in the current task to not done, it should work
    createdTasks.push(tasksService.update(thirdTask.id, { ...newTask, isDone: false } as TaskDTO));

    expect(createdTasks[2]).not.toBeUndefined();
    expect(createdTasks[2].id).toBe(thirdTask.id);
    expect(createdTasks[2].isDone).toBe(false);
  });
});
