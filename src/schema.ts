import { makeSchema } from 'nexus';
import * as PhasesResolver from './resolvers/phases.resolver';
//import * as TasksResolver from './resolvers/tasks.resolver';

export const schema = makeSchema({
  types: [PhasesResolver.Phase, PhasesResolver.findAll, PhasesResolver.create]
});
