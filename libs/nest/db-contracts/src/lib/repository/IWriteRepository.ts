/** Write-only contract for any data store. */
export interface IWriteRepository<T, ID = string> {
  save(entity: T): Promise<T>;
  saveMany(entities: T[]): Promise<T[]>;
  delete(id: ID): Promise<void>;
  deleteMany(ids: ID[]): Promise<void>;
}
