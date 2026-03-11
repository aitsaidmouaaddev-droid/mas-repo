// Mock expo-video — native video player, not available in Jest/Node
jest.mock('expo-video', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createVideoPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      replace: jest.fn(),
      remove: jest.fn(),
      seekBy: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      muted: false,
      volume: 1,
      currentTime: 0,
      status: 'readyToPlay',
    })),
    VideoView: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'expo-video-view', ...props }),
    VideoPlayer: jest.fn(),
  };
});

// Mock expo useEventListener — event subscription util, no-op in tests
jest.mock('expo', () => ({
  useEventListener: jest.fn(),
}));
