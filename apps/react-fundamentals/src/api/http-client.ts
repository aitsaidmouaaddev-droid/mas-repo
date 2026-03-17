/** Base URL of the local Express API. */
const API_BASE = 'http://localhost:4311';

/**
 * Thin fetch wrapper used by all repositories.
 *
 * Throws on non-2xx responses so repositories never have to inspect
 * `response.ok` themselves.
 */
export class HttpClient {
  constructor(private baseUrl: string = API_BASE) {}

  /**
   * Performs a GET request and deserialises the JSON body.
   *
   * @param path - Path relative to {@link baseUrl} (e.g. `'/api/qcm'`).
   * @throws {Error} When the response status is not 2xx.
   */
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`);
    return res.json() as Promise<T>;
  }

  /**
   * Performs a POST request with a JSON body and deserialises the response.
   *
   * @param path - Path relative to {@link baseUrl}.
   * @param body - Value to serialise as the request body.
   * @throws {Error} When the response status is not 2xx.
   */
  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`);
    return res.json() as Promise<T>;
  }
}
