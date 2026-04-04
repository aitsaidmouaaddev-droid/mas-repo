import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { SceneData } from '../job-version/video-job-data.types';

export type SrtLang = 'en' | 'fr' | 'ar';

@Injectable()
export class SrtService {
  generateAll(scenes: SceneData[], outputDir: string): Record<SrtLang, string> {
    fs.mkdirSync(path.join(outputDir, 'subtitles'), { recursive: true });

    const langs: SrtLang[] = ['en', 'fr', 'ar'];
    const paths: Record<string, string> = {};

    for (const lang of langs) {
      const content = this.buildSrt(scenes, lang);
      const filePath = path.join(outputDir, 'subtitles', `subtitles-${lang}.srt`);
      fs.writeFileSync(filePath, content, 'utf-8');
      paths[lang] = filePath;
    }

    return paths as Record<SrtLang, string>;
  }

  private buildSrt(scenes: SceneData[], lang: SrtLang): string {
    const blocks: string[] = [];
    let cursor = 0;

    scenes.forEach((scene, index) => {
      const start = cursor;
      const end = cursor + scene.durationSeconds;
      cursor = end;

      const text = scene.subtitleTracks?.[lang] ?? scene.voiceText ?? '';

      blocks.push(`${index + 1}\n${this.formatTime(start)} --> ${this.formatTime(end)}\n${text}`);
    });

    return blocks.join('\n\n') + '\n';
  }

  private formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.round((seconds % 1) * 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)},${pad3(ms)}`;
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}
