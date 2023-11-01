import { randomUUID } from 'crypto';

export class Model<T> {
  protected title: string = '';

  protected collection: Map<string, T>;

  public constructor() {
    this.collection = new Map<string, T>();
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public find(id: string): T | undefined {
    return this.collection.get(id);
  }

  public findAll() {
    return this.collection;
  }

  public create(object: T) {
    const id = randomUUID();
    this.collection.set(id, object);
    return { id, ...object };
  }

  public update(id: string, item: T) {
    if (this.collection.has(id)) {
      this.collection.set(id, item);
    }
  }

  public delete(id: string) {
    this.collection.delete(id);
  }
}
