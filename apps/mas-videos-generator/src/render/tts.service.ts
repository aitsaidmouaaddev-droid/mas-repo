import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as textToSpeech from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as path from 'path';
import type { SceneData } from '../job-version/video-job-data.types';

export interface SceneAudioResult {
  sceneId: string;
  filePath: string;
  durationMs: number;
  fileSize: number;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly client: textToSpeech.TextToSpeechClient;

  constructor(private readonly config: ConfigService) {
    const credentials = JSON.parse(config.getOrThrow<string>('GOOGLE_TTS_KEY_JSON')) as object;
    this.client = new textToSpeech.TextToSpeechClient({ credentials });
  }

  async synthesiseScenes(
    scenes: SceneData[],
    outputDir: string,
    voiceLanguage: string,
  ): Promise<SceneAudioResult[]> {
    fs.mkdirSync(path.join(outputDir, 'audio'), { recursive: true });

    const results: SceneAudioResult[] = [];

    for (const scene of scenes) {
      const result = await this.synthesiseScene(scene, outputDir, voiceLanguage);
      results.push(result);
    }

    return results;
  }

  private async synthesiseScene(
    scene: SceneData,
    outputDir: string,
    voiceLanguage: string,
  ): Promise<SceneAudioResult> {
    const filePath = path.join(outputDir, 'audio', `scene-${scene.sceneId}.mp3`);

    this.logger.debug(`TTS: synthesising scene ${scene.sceneId}`);

    const [response] = await this.client.synthesizeSpeech({
      input: { text: scene.voiceText },
      voice: {
        languageCode: this.toLanguageCode(voiceLanguage),
        ssmlGender: 'NEUTRAL' as const,
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    });

    if (!response.audioContent) {
      throw new Error(`TTS returned empty audio for scene ${scene.sceneId}`);
    }

    const buffer = Buffer.isBuffer(response.audioContent)
      ? response.audioContent
      : Buffer.from(response.audioContent as Uint8Array);

    fs.writeFileSync(filePath, buffer);

    // Estimate duration from file size (~128 kbps MP3 = 16 KB/s)
    const estimatedMs = Math.round((buffer.length / 16000) * 1000);

    return {
      sceneId: scene.sceneId,
      filePath,
      durationMs: estimatedMs,
      fileSize: buffer.length,
    };
  }

  /** Map ISO 639-1 language codes to BCP-47 codes for Google TTS. */
  private toLanguageCode(lang: string): string {
    const MAP: Record<string, string> = {
      en: 'en-US',
      fr: 'fr-FR',
      ar: 'ar-XA',
      es: 'es-ES',
      de: 'de-DE',
      it: 'it-IT',
      pt: 'pt-BR',
      ja: 'ja-JP',
      zh: 'cmn-CN',
    };
    return MAP[lang.toLowerCase()] ?? `${lang}-${lang.toUpperCase()}`;
  }
}
