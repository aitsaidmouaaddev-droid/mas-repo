import type { IReadRepository } from '@mas/frontend-dal';
import type { QcmModule, QcmData } from '@mas/shared/qcm';
import type { HttpClient } from './http-client';

/**
 * HTTP implementation of a read-only QCM repository.
 *
 * Implements the relevant subset of {@link IReadRepository} now; swap with a
 * DB-backed implementation (SQLite, REST, etc.) without touching consumers.
 */
export class QcmRepository
  implements Pick<IReadRepository<QcmModule, string>, 'getAll' | 'getById'>
{
  constructor(private client: HttpClient) {}

  /**
   * Fetches all QCM modules from the API.
   * @returns Flat list of {@link QcmModule} objects ready for `startSession`.
   */
  async getAll(): Promise<QcmModule[]> {
    const data = await this.client.get<QcmData>('/api/qcm');
    return data.modules;
  }

  /**
   * Finds a single module by its string `id`.
   * @returns The matching {@link QcmModule}, or `null` if not found.
   */
  async getById(id: string): Promise<QcmModule | null> {
    const modules = await this.getAll();
    return modules.find((m) => m.id === id) ?? null;
  }

  /**
   * Fetches the list of enabled app modes (e.g. `['code', 'qcm']`).
   * Used by the home screen to decide which mode cards to render.
   */
  async getModes(): Promise<string[]> {
    const data = await this.client.get<{ modes: string[] }>('/api/modes');
    return data.modes;
  }
}
