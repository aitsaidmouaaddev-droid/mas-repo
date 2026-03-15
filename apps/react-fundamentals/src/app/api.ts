const API_BASE = 'http://localhost:4311';

export interface TestResult {
  title: string;
  status: string;
  failureMessages: string[];
}

export interface RunResult {
  passed: number;
  failed: number;
  tests: TestResult[];
  logs: string;
}

export interface TestEntry {
  selector: string;
  title: string;
}

export interface FileEntry {
  selector: string;
  fileName: string;
  tests: TestEntry[];
}

export interface ModuleEntry {
  moduleIndex: number;
  moduleName: string;
  files: FileEntry[];
}

export interface QcmQuestion {
  id: string;
  module: string;
  question: string;
  choices: string[];
  answer: number;
}

export async function fetchModes(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/modes`);
  const data = await res.json();
  return data.modes;
}

export async function fetchCatalog(): Promise<ModuleEntry[]> {
  const res = await fetch(`${API_BASE}/api/code/catalog`);
  const data = await res.json();
  return data.modules;
}

export async function runTest(selector: string): Promise<RunResult> {
  const res = await fetch(`${API_BASE}/api/code/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selector }),
  });
  return res.json();
}

export async function fetchQcm(): Promise<QcmQuestion[]> {
  const res = await fetch(`${API_BASE}/api/qcm`);
  const data = await res.json();
  return data.questions;
}
