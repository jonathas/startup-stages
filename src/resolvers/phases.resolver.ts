import { objectType, stringArg, intArg, nonNull, extendType } from 'nexus';
import { PhasesService } from '../services/phases.service';
import { Void } from '../shared/scalar-types';
import { TasksService } from '../services/tasks.service';

const phasesService = new PhasesService();
const tasksService = new TasksService();

const Phase = objectType({
  name: 'Phase',
  definition(t) {
    t.string('id');
    t.int('order');
    t.string('title');
    t.boolean('isDone', {
      resolve: (parent) => phasesService.isPhaseDone(parent.id)
    });

    /**
     * This field resolver would work better with a dataloader if we were using a database,
     * in order to avoid the N+1 problem.
     */
    t.list.field('tasks', {
      type: 'Task',
      resolve: (parent) => tasksService.findAllByPhaseId(parent.id)
    });
  }
});

const findAll = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('phases', {
      type: 'Phase',
      resolve: () => phasesService.findAll()
    });
  }
});

const find = extendType({
  type: 'Query',
  definition(t) {
    t.field('phase', {
      type: 'Phase',
      args: {
        id: stringArg({ description: 'Id of the phase' })
      },
      resolve: (parent, { id }) => phasesService.find(id)
    });
  }
});

const create = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createPhase', {
      type: 'Phase',
      args: {
        title: stringArg({ description: 'Title of the phase' }),
        order: intArg({ description: 'Order of the phase' })
      },
      resolve: (parent, args) => phasesService.create(args)
    });
  }
});

const update = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('updatePhase', {
      type: 'Phase',
      args: {
        id: nonNull(stringArg({ description: 'Id of the phase' })),
        title: stringArg({ description: 'Title of the phase' }),
        order: intArg({ description: 'Order of the phase' })
      },
      resolve: (parent, args) => phasesService.update(args)
    });
  }
});

const deletePhase = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('deletePhase', {
      type: Void,
      args: {
        id: nonNull(stringArg({ description: 'Id of the phase' }))
      },
      resolve: (parent, { id }) => phasesService.delete(id)
    });
  }
});

export { Phase, findAll, find, create, update, deletePhase };
