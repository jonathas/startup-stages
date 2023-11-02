import { objectType, extendType, stringArg, booleanArg, nonNull } from 'nexus';
import { TasksService } from '../services/tasks.service';
import { Void } from '../shared/scalar-types';
const tasksService = new TasksService();

const Task = objectType({
  name: 'Task',
  definition(t) {
    t.string('id');
    t.string('title');
    t.boolean('isDone');
    t.string('phaseId');
  }
});

const findAll = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('tasks', {
      type: 'Task',
      resolve: () => tasksService.findAll()
    });
  }
});

const find = extendType({
  type: 'Query',
  definition(t) {
    t.field('task', {
      type: 'Task',
      args: {
        id: stringArg({ description: 'Id of the task' })
      },
      resolve: (parent, { id }) => tasksService.find(id)
    });
  }
});

const create = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createTask', {
      type: 'Task',
      args: {
        title: nonNull(stringArg({ description: 'Title of the task' })),
        phaseId: nonNull(stringArg({ description: 'Id of the phase' })),
        isDone: nonNull(booleanArg({ description: 'Is the task done?' }))
      },
      resolve: (parent, args) => tasksService.create(args)
    });
  }
});

const update = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updateTask', {
      type: 'Task',
      args: {
        id: nonNull(stringArg({ description: 'Id of the task' })),
        title: stringArg({ description: 'Title of the task' }),
        isDone: booleanArg({ description: 'Is the task done?' })
      },
      resolve: (parent, args) => tasksService.update(args)
    });
  }
});

const deleteTask = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deleteTask', {
      type: Void,
      args: {
        id: nonNull(stringArg({ description: 'Id of the task' }))
      },
      resolve: (parent, { id }) => tasksService.delete(id)
    });
  }
});

export { Task, findAll, find, create, update, deleteTask };
