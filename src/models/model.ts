import { randomUUID } from 'crypto';

export class Model<T> {
  public id: string = '';

  public title: string = '';

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
    return Array.from(this.collection.values());
  }

  public create(object: Partial<T>) {
    const id = randomUUID();
    const data = { id, ...object } as T;
    this.collection.set(id, data);
    return data;
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
