import {
  InMemoryRepository,
  Sorter,
  numericAscending,
  alphabeticAscending,
  Observable,
} from './01-design-patterns';

type Product = { id: string; name: string; price: number };

describe('01 — Design Patterns', () => {
  describe('InMemoryRepository', () => {
    let repo: InMemoryRepository<Product>;

    beforeEach(() => {
      repo = new InMemoryRepository<Product>();
    });

    it('should add and find by id', () => {
      repo.add({ id: '1', name: 'Apple', price: 0.99 });
      expect(repo.findById('1')).toEqual({ id: '1', name: 'Apple', price: 0.99 });
    });

    it('should return undefined for missing id', () => {
      expect(repo.findById('999')).toBeUndefined();
    });

    it('findAll should return all items', () => {
      repo.add({ id: '1', name: 'Apple', price: 0.99 });
      repo.add({ id: '2', name: 'Banana', price: 0.49 });
      expect(repo.findAll()).toHaveLength(2);
    });

    it('update should apply changes', () => {
      repo.add({ id: '1', name: 'Apple', price: 0.99 });
      const updated = repo.update('1', { price: 1.99 });
      expect(updated?.price).toBe(1.99);
      expect(updated?.name).toBe('Apple');
    });

    it('update should return undefined for missing id', () => {
      expect(repo.update('999', { price: 0 })).toBeUndefined();
    });

    it('remove should delete and return true', () => {
      repo.add({ id: '1', name: 'Apple', price: 0.99 });
      expect(repo.remove('1')).toBe(true);
      expect(repo.findById('1')).toBeUndefined();
    });

    it('remove should return false for missing id', () => {
      expect(repo.remove('999')).toBe(false);
    });
  });

  describe('Sorter', () => {
    it('should sort numbers ascending', () => {
      const sorter = new Sorter<number>(numericAscending);
      expect(sorter.sort([3, 1, 4, 1, 5, 9, 2])).toEqual([1, 1, 2, 3, 4, 5, 9]);
    });

    it('should not mutate original array', () => {
      const original = [3, 1, 2];
      const sorter = new Sorter<number>(numericAscending);
      sorter.sort(original);
      expect(original).toEqual([3, 1, 2]);
    });

    it('should sort strings alphabetically', () => {
      const sorter = new Sorter<string>(alphabeticAscending);
      expect(sorter.sort(['banana', 'apple', 'cherry'])).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should use new strategy after setStrategy', () => {
      const sorter = new Sorter<number>(numericAscending);
      sorter.setStrategy((a, b) => b - a); // descending
      expect(sorter.sort([1, 3, 2])).toEqual([3, 2, 1]);
    });
  });

  describe('Observable', () => {
    it('should notify subscribers on next', () => {
      const obs = new Observable<number>();
      const values: number[] = [];
      obs.subscribe((v) => values.push(v));
      obs.next(1);
      obs.next(2);
      obs.next(3);
      expect(values).toEqual([1, 2, 3]);
    });

    it('should stop notifying after unsubscribe', () => {
      const obs = new Observable<string>();
      const values: string[] = [];
      const unsub = obs.subscribe((v) => values.push(v));
      obs.next('a');
      unsub(); // unsubscribe
      obs.next('b');
      expect(values).toEqual(['a']);
    });

    it('should notify multiple subscribers', () => {
      const obs = new Observable<number>();
      const a: number[] = [];
      const b: number[] = [];
      obs.subscribe((v) => a.push(v));
      obs.subscribe((v) => b.push(v));
      obs.next(42);
      expect(a).toEqual([42]);
      expect(b).toEqual([42]);
    });

    it('complete should remove all subscriptions', () => {
      const obs = new Observable<number>();
      const values: number[] = [];
      obs.subscribe((v) => values.push(v));
      obs.complete();
      obs.next(99);
      expect(values).toHaveLength(0);
    });
  });
});
