import { objectType, stringArg, intArg, nonNull, extendType } from 'nexus';
import { plainToInstance } from 'class-transformer';
import { PhasesService } from '../services/phases.service';
import { Void } from '../shared/scalar-types';
import { TasksService } from '../services/tasks.service';
import { CreatePhaseInput, UpdatePhaseInput } from '../dto/phase.dto';

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
      resolve: (parent) => tasksService.getAllByPhaseId(parent.id)
    });
  }
});

const getAll = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('phases', {
      type: 'Phase',
      resolve: () => phasesService.getAll()
    });
  }
});

const getOne = extendType({
  type: 'Query',
  definition(t) {
    t.field('phase', {
      type: 'Phase',
      args: {
        id: stringArg({ description: 'Id of the phase' })
      },
      resolve: (parent, { id }) => phasesService.getOne(id)
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
      resolve: (parent, args) => phasesService.create(plainToInstance(CreatePhaseInput, args))
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
      resolve: (parent, args) => phasesService.update(plainToInstance(UpdatePhaseInput, args))
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

export { Phase, getAll, getOne, create, update, deletePhase };
