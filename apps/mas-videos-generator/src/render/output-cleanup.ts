import * as path from 'path';
import * as fs from 'fs';

export function jobOutputDir(jobId: string): string {
  return path.resolve(process.cwd(), 'output', 'jobs', jobId);
}

export function deleteJobOutput(jobId: string, logger: { log: (msg: string) => void }): void {
  const dir = jobOutputDir(jobId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    logger.log(`Cleanup: deleted output for job ${jobId}`);
  }
}
