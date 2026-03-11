module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxRuntime: 'automatic',
        },
      ],
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            '@components': ['./app/components'],
            '@mocks': ['./mocks'],
            '@styles': ['./styles'],
            '@mas/rn/ui': ['../../libs/react-native/ui/src'],
            '@mas/rn/store': ['../../libs/react-native/store/src'],
            '@mas/rn/database': ['../../libs/react-native/database/src'],
            '@mas/rn/media': ['../../libs/react-native/media/src'],
            '@mas/shared/types': ['../../libs/shared/types/src'],
          },
        },
      ],
    ],
  };
};
