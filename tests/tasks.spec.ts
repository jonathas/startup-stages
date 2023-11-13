/* eslint-disable max-lines-per-function */
import { CreatePhaseInput } from '../src/dto/phase.dto';
import { CreateTaskInput, UpdateTaskInput } from '../src/dto/task.dto';
import { PhaseModel } from '../src/models/phase.model';
import { TaskModel } from '../src/models/task.model';
import { PhasesService } from '../src/services/phases.service';
import { TasksService } from '../src/services/tasks.service';

describe('# Tasks', () => {
  const phase: CreatePhaseInput = {
    order: 1,
    title: 'Foundation'
  };
  const secondPhase: CreatePhaseInput = {
    order: 2,
    title: 'Discovery'
  };
  const task: Partial<CreateTaskInput> = {
    title: 'Setup virtual office',
    isDone: false
  };
  const newTask: Partial<CreateTaskInput> = {
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

  it('should be possible to create a task', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create(task as CreateTaskInput));

    expect(createdTasks[0].id).not.toBeUndefined();
    expect(createdTasks[0].title).toBe('Setup virtual office');
    expect(createdTasks[0].isDone).toBe(false);
    expect(createdTasks[0].phaseId).toBe(createdPhases[0].id);
  });

  it('should not be possible to create a task without a phase', async () => {
    await expect(() => tasksService.create(task as CreateTaskInput)).rejects.toThrow(
      'Phase not found'
    );
  });

  it('should be possible to get a task', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create(task as CreateTaskInput));
    const found = tasksService.getOne(createdTasks[0].id);

    expect(found).not.toBeUndefined();
    expect(found.id).toBe(createdTasks[0].id);
    expect(found.title).toBe('Setup virtual office');
    expect(found.isDone).toBe(false);
    expect(found.phaseId).toBe(createdPhases[0].id);
  });

  it('should be possible to update a task', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create(task as CreateTaskInput));
    const updated = await tasksService.update({
      ...newTask,
      id: createdTasks[0].id
    } as UpdateTaskInput);

    expect(updated).not.toBeUndefined();
    expect(updated.id).toBe(createdTasks[0].id);
    expect(updated.title).toBe('Setup virtual office today');
    expect(updated.isDone).toBe(true);
    expect(updated.phaseId).toBe(createdPhases[0].id);
  });

  it('should not be possible to update a task if it does not exist', async () => {
    await expect(() =>
      tasksService.update({ ...newTask, id: '123' } as UpdateTaskInput)
    ).rejects.toThrow('Task not found');
  });

  it('should be possible to get all tasks', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create(task as CreateTaskInput));
    const secondTask = await tasksService.create({
      ...newTask,
      phaseId: createdPhases[0].id
    } as CreateTaskInput);
    const found = tasksService.getAll();

    expect(found).not.toBeUndefined();
    expect(found).toHaveLength(2);
    expect(found[0].id).toBe(createdTasks[0].id);
    expect(found[0].title).toBe('Setup virtual office');
    expect(found[0].isDone).toBe(false);
    expect(found[0].phaseId).toBe(createdPhases[0].id);

    tasksService.delete(secondTask.id);
  });

  it('should be possible to delete a task', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    const res = await tasksService.create(task as CreateTaskInput);
    tasksService.delete(res.id);

    expect(() => tasksService.getOne(res.id)).toThrow('Task not found');
  });

  it('should not complete a task if any task in the previous phase is not completed', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create(task as CreateTaskInput)); // isDone = false

    newTask.phaseId = createdPhases[0].id;
    createdTasks.push(await tasksService.create(newTask as CreateTaskInput)); // isDone = true

    // Meaning that not all tasks in the Foundation phase are completed

    createdPhases.push(await phasesService.create(secondPhase));

    /**
     * Third task cannot be created as done, since at least one of the tasks in the previous
     * phase is not done
     */
    await expect(() =>
      tasksService.create({ ...newTask, phaseId: createdPhases[1].id } as CreateTaskInput)
    ).rejects.toThrow('Tasks from the previous phase are not completed');

    // If it is created as not done, it should work
    const res = await tasksService.create({
      ...newTask,
      phaseId: createdPhases[1].id,
      isDone: false
    } as CreateTaskInput);

    expect(res).not.toBeUndefined();
    expect(res.id).not.toBeUndefined();
    expect(res.isDone).toBe(false);

    // But then if we try to update it as done, it should not work
    await expect(() =>
      tasksService.update({ id: res.id, isDone: true } as UpdateTaskInput)
    ).rejects.toThrow('Tasks from the previous phase are not completed');
  });

  it('should set a task to not done only if all tasks in the next phase are not done', async () => {
    createdPhases.push(await phasesService.create(phase));
    task.phaseId = createdPhases[0].id;

    createdTasks.push(await tasksService.create({ ...task, isDone: true } as CreateTaskInput));

    newTask.phaseId = createdPhases[0].id;
    createdTasks.push(await tasksService.create(newTask as CreateTaskInput)); // isDone = true

    // Meaning that all tasks in the Foundation phase are completed

    createdPhases.push(await phasesService.create(secondPhase));

    // The first task in the second phase is also done
    const thirdTask = await tasksService.create({
      ...newTask,
      phaseId: createdPhases[1].id,
      isDone: true
    } as CreateTaskInput);

    // If we try to set any task in the previous phase to not done, it should not work
    await expect(() =>
      tasksService.update({ ...task, isDone: false, id: createdTasks[1].id } as UpdateTaskInput)
    ).rejects.toThrow(
      `At least one task from the next phase is already completed, ` +
        `so this task cannot be updated to not done`
    );

    // If we try to set any task in the current task to not done, it should work
    createdTasks.push(
      await tasksService.update({ ...newTask, isDone: false, id: thirdTask.id } as UpdateTaskInput)
    );

    expect(createdTasks[2]).not.toBeUndefined();
    expect(createdTasks[2].id).toBe(thirdTask.id);
    expect(createdTasks[2].isDone).toBe(false);
  });
});
