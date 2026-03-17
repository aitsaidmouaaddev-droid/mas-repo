/** Result for a single Jest `it` / `test` block. */
export interface TestResult {
  /** Human-readable test title (e.g. `'renders without crashing'`). */
  title: string;
  /** `'passed'` or `'failed'`. */
  status: string;
  /** Jest failure messages; empty when the test passes. */
  failureMessages: string[];
}

/** Aggregated result returned by the API after running a test file or suite. */
export interface RunResult {
  /** Number of tests that passed. */
  passed: number;
  /** Number of tests that failed. */
  failed: number;
  /** Per-test breakdown. */
  tests: TestResult[];
  /** Captured `console.*` output produced during the run. */
  logs: string;
}

/** A single `it` / `test` block within a file. */
export interface TestEntry {
  /** Unique selector used to run only this test (e.g. `'01/01 renders without crashing'`). */
  selector: string;
  /** Human-readable title of the test. */
  title: string;
}

/** A single test file discovered by the server. */
export interface FileEntry {
  /** Selector passed to the run endpoint to execute all tests in this file. */
  selector: string;
  /** Filename with extension (e.g. `'01-rendering-elements.test.tsx'`). */
  fileName: string;
  /** All test blocks declared inside this file. */
  tests: TestEntry[];
}

/** A learning module — a top-level folder grouping related exercise files. */
export interface ModuleEntry {
  /** 1-based module number derived from the folder name prefix. */
  moduleIndex: number;
  /** Display name of the module (e.g. `'jsx-basics'`). */
  moduleName: string;
  /** Exercise files belonging to this module. */
  files: FileEntry[];
}

/** Category grouping for TDT challenges. */
export type TdtCategory = 'react-hooks' | 'architecture';

/** Difficulty level for a TDT challenge. */
export type TdtDifficulty = 'easy' | 'medium' | 'hard';

/** A single TDT challenge as returned by the catalog endpoint. */
export interface TdtChallenge {
  id: string;
  title: string;
  category: TdtCategory;
  difficulty: TdtDifficulty;
  description: string;
  starterCode: string;
  testCode: string;
}
