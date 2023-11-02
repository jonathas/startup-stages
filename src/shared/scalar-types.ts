import { scalarType } from 'nexus';

const Void = scalarType({
  name: 'Void',
  asNexusMethod: 'void',
  serialize() {
    return null;
  },
  parseValue() {
    return null;
  },
  parseLiteral() {
    return null;
  }
});

export { Void };
