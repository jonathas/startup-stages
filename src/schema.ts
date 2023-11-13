import { makeSchema } from 'nexus';
import * as PhasesResolver from './resolvers/phases.resolver';
import * as TasksResolver from './resolvers/tasks.resolver';

export const schema = makeSchema({
  types: [...Object.values(PhasesResolver), ...Object.values(TasksResolver)]
});
