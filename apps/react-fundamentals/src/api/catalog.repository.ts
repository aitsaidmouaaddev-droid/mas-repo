import type { IReadRepository } from '@mas/frontend-dal';
import type { ModuleEntry, RunResult } from './types';
import type { HttpClient } from './http-client';

/**
 * HTTP implementation of the code-catalog repository.
 *
 * Implements the relevant subset of {@link IReadRepository} now; ready to be
 * extended with write operations (save results, track progress, etc.).
 */
export class CatalogRepository implements Pick<IReadRepository<ModuleEntry, number>, 'getAll'> {
  constructor(private client: HttpClient) {}

  /**
   * Fetches all exercise modules discovered by the API server.
   * @returns Modules ordered by `moduleIndex`.
   */
  async getAll(): Promise<ModuleEntry[]> {
    const data = await this.client.get<{ modules: ModuleEntry[] }>('/api/code/catalog');
    return data.modules;
  }

  /**
   * Asks the API to run a specific Jest test selector and returns the result.
   *
   * @param selector - A file-level or test-level selector string
   *   (e.g. `'01/01'` for a whole file or `'01/01/renders'` for a single test).
   * @returns Aggregated pass/fail counts + per-test details.
   */
  async runTest(selector: string): Promise<RunResult> {
    return this.client.post<RunResult>('/api/code/run', { selector });
  }
}
