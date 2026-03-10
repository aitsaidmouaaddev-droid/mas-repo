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
            '@mas/rn/hooks': ['../../libs/react-native/hooks/src'],
            '@mas/rn/services': ['../../libs/react-native/services/src'],
            '@mas/rn/store': ['../../libs/react-native/store/src'],
            '@mas/rn/database': ['../../libs/react-native/database/src'],
            '@mas/shared/config': ['../../libs/shared/config/src'],
            '@mas/shared/types': ['../../libs/shared/types/src'],
          },
        },
      ],
    ],
  };
};
