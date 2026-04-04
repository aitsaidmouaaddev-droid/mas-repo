import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fal } from '@fal-ai/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import type { SceneData } from '../job-version/video-job-data.types';

export interface SceneVideoResult {
  sceneId: string;
  filePath: string;
}

@Injectable()
export class FalVideoService {
  private readonly logger = new Logger(FalVideoService.name);

  constructor(private readonly config: ConfigService) {
    fal.config({ credentials: config.getOrThrow<string>('FAL_API_KEY') });
  }

  async generateSceneVideos(
    scenes: SceneData[],
    outputDir: string,
    onProgress?: (sceneIndex: number, total: number) => void,
  ): Promise<SceneVideoResult[]> {
    const videoDir = path.join(outputDir, 'scenes');
    fs.mkdirSync(videoDir, { recursive: true });

    const results: SceneVideoResult[] = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      onProgress?.(i + 1, scenes.length);

      this.logger.log(
        `Fal: generating video for scene ${i + 1}/${scenes.length} — "${scene.sceneId}"`,
      );

      const filePath = await this.generateClip(scene, videoDir, i);
      results.push({ sceneId: scene.sceneId, filePath });
    }

    return results;
  }

  private async generateClip(scene: SceneData, videoDir: string, _index: number): Promise<string> {
    const prompt = scene.visual?.prompt ?? scene.voiceText ?? scene.sceneId;
    // num_frames: 81–100 at 16fps = ~5–6s. Cap at 100 for longer scenes.
    const fps = 16;
    const num_frames = Math.min(100, Math.max(81, Math.round(scene.durationSeconds * fps)));

    const result = await fal.subscribe('fal-ai/wan-t2v', {
      input: {
        prompt,
        num_frames,
        frames_per_second: fps,
        aspect_ratio: '16:9',
        resolution: '480p',
        num_inference_steps: 20,
      },
      logs: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoUrl: string = (result as any).data?.video?.url ?? (result as any).video?.url;
    if (!videoUrl) throw new Error(`Fal returned no video URL for scene ${scene.sceneId}`);

    const filePath = path.join(videoDir, `scene-${scene.sceneId}.mp4`);
    await this.downloadFile(videoUrl, filePath);
    return filePath;
  }

  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      const client = url.startsWith('https') ? https : http;
      client
        .get(url, (res) => {
          res.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
        })
        .on('error', (err) => {
          fs.unlink(dest, () => undefined);
          reject(err);
        });
    });
  }
}
