import { registerRoot } from 'remotion';
import React from 'react';
import { Composition } from 'remotion';
import { VideoComposition } from './VideoComposition';
import type { VideoCompositionProps } from './VideoComposition';

function RemotionRoot() {
  return (
    <>
      <Composition<VideoCompositionProps>
        id="VideoComposition"
        component={VideoComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: [] }}
        calculateMetadata={async ({ props }) => {
          const totalFrames = props.scenes.reduce(
            (sum, s) => sum + Math.round(s.durationSeconds * 30),
            0,
          );
          return { durationInFrames: totalFrames || 300 };
        }}
      />
    </>
  );
}

registerRoot(RemotionRoot);
