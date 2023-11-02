import { makeSchema } from 'nexus';
import * as PhasesResolver from './resolvers/phases.resolver';
import * as TasksResolver from './resolvers/tasks.resolver';

export const schema = makeSchema({
  types: [
    PhasesResolver.Phase,
    PhasesResolver.findAll,
    PhasesResolver.find,
    PhasesResolver.create,
    PhasesResolver.update,
    PhasesResolver.deletePhase,
    TasksResolver.Task,
    TasksResolver.findAll,
    TasksResolver.find,
    TasksResolver.create,
    TasksResolver.update,
    TasksResolver.deleteTask
  ]
});
