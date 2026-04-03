import React from 'react';
import { AbsoluteFill, Audio, Video, staticFile } from 'remotion';

interface SceneProps {
  sceneId: string;
  voiceText: string;
  audioFile: string;
  videoFile?: string;
  bgColor: string;
  overlayText?: string;
}

export function Scene({ audioFile, videoFile, bgColor, overlayText }: SceneProps) {
  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* AI-generated background video — fills the frame, muted */}
      {videoFile && (
        <Video
          src={staticFile(videoFile)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          volume={0}
        />
      )}

      {/* Voice audio */}
      {audioFile && <Audio src={staticFile(audioFile)} />}

      {/* Optional overlay text (chapter title, CTA, etc.) */}
      {overlayText && (
        <AbsoluteFill
          style={{ justifyContent: 'flex-start', alignItems: 'flex-start', padding: 60 }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,.8)',
              lineHeight: 1.2,
              background: 'rgba(0,0,0,0.4)',
              padding: '12px 24px',
              borderRadius: 10,
            }}
          >
            {overlayText}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}
