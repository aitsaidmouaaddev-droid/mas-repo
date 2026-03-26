import {
  EventSubscriber,
  type EntitySubscriberInterface,
  type InsertEvent,
  type UpdateEvent,
  type RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  afterInsert(event: InsertEvent<unknown>): void {
    console.log(`[DB] INSERT ${event.metadata.name}`, event.entity);
  }

  afterUpdate(event: UpdateEvent<unknown>): void {
    console.log(`[DB] UPDATE ${event.metadata.name}`, event.entity);
  }

  afterRemove(event: RemoveEvent<unknown>): void {
    console.log(`[DB] REMOVE ${event.metadata.name} id=${event.entityId}`);
  }
}
