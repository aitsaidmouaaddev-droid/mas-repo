import type { HttpClient } from './http-client';
import type { TdtChallenge, RunResult } from './types';

/**
 * Repository for TDT challenge catalog and test execution.
 */
export class TdtRepository {
  constructor(private readonly client: HttpClient) {}

  /** Fetch all challenges (starterCode included, testCode excluded). */
  async getAll(): Promise<TdtChallenge[]> {
    const data = await this.client.get<{ challenges: TdtChallenge[] }>('/api/tdt');
    return data.challenges;
  }

  /**
   * Send user implementation to the backend, run the pre-stored tests,
   * and return the aggregated result.
   */
  async run(challengeId: string, impl: string): Promise<RunResult> {
    return this.client.post<RunResult>('/api/tdt/run', { challengeId, impl });
  }
}
