import { objectType, stringArg, intArg, nonNull, extendType } from 'nexus';
import { plainToClass } from 'class-transformer';
import { PhasesService } from '../services/phases.service';
import { CreatePhaseInput } from '../dto/phase.dto';
import { Void } from '../shared/scalar-types';
const phasesService = new PhasesService();

const Phase = objectType({
  name: 'Phase',
  definition(t) {
    t.string('id');
    t.int('order');
    t.string('title');
    t.boolean('isDone', {
      resolve: (parent) => phasesService.isPhaseDone(parent.id)
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
      resolve: (parent, args) => phasesService.create(plainToClass(CreatePhaseInput, args))
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
