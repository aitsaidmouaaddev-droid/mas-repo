import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { Scene } from './Scene';

const BG_COLORS = ['#1a1a2e', '#16213e', '#0f3460', '#1b1b2f', '#2c2c54'];

export interface RemotionSceneProps {
  sceneId: string;
  durationSeconds: number;
  voiceText: string;
  audioFile: string;
  videoFile?: string;
  overlayText?: string;
  bgColorIndex?: number;
}

export interface VideoCompositionProps {
  scenes: RemotionSceneProps[];
}

export function VideoComposition({ scenes }: VideoCompositionProps) {
  const { fps } = useVideoConfig();
  let frameOffset = 0;

  return (
    <AbsoluteFill>
      {scenes.map((scene) => {
        const durationInFrames = Math.round(scene.durationSeconds * fps);
        const from = frameOffset;
        frameOffset += durationInFrames;

        return (
          <Sequence key={scene.sceneId} from={from} durationInFrames={durationInFrames}>
            <Scene
              sceneId={scene.sceneId}
              voiceText={scene.voiceText}
              audioFile={scene.audioFile}
              videoFile={scene.videoFile}
              bgColor={BG_COLORS[(scene.bgColorIndex ?? 0) % BG_COLORS.length]}
              overlayText={scene.overlayText}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
