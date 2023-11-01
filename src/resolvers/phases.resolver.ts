import { objectType, queryType, mutationType, stringArg, intArg } from 'nexus';
import { PhasesService } from '../services/phases.service';
const phasesService = new PhasesService();

const Phase = objectType({
  name: 'Phase',
  definition(t) {
    t.string('id');
    t.int('order');
    t.string('title');
  }
});

const findAll = queryType({
  definition(t) {
    t.list.field('phases', {
      type: 'Phase',
      resolve: () => phasesService.findAll()
    });
  }
});

const create = mutationType({
  definition(t) {
    t.field('createPhase', {
      type: 'Phase',
      args: {
        title: stringArg({ description: 'Title of the phase' }),
        order: intArg({ description: 'Order of the phase' })
      },
      resolve: (parent, { title, order }) => {
        return phasesService.create({ title, order });
      }
    });
  }
});

export { Phase, findAll, create };
