/**
 * @module api
 *
 * Singleton repository instances and shared API types for the
 * `react-fundamentals` app.
 *
 * Import from this barrel — never from individual repository files — so the
 * singleton instances are shared across the whole app.
 *
 * @example
 * ```ts
 * import { qcmRepository, catalogRepository } from '../api';
 * const modules = await qcmRepository.getAll();
 * ```
 */

import { HttpClient } from './http-client';
import { QcmRepository } from './qcm.repository';
import { CatalogRepository } from './catalog.repository';

const client = new HttpClient();

/** Shared {@link QcmRepository} instance. */
export const qcmRepository = new QcmRepository(client);

/** Shared {@link CatalogRepository} instance. */
export const catalogRepository = new CatalogRepository(client);

export type { ModuleEntry, FileEntry, TestEntry, TestResult, RunResult } from './types';
export { HttpClient } from './http-client';
export { QcmRepository } from './qcm.repository';
export { CatalogRepository } from './catalog.repository';
