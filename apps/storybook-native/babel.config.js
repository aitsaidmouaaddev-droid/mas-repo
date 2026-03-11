module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            '@mas/rn/ui': ['../../libs/react-native/ui/src'],
            '@mas/rn/hooks': ['../../libs/react-native/hooks/src'],
            '@mas/rn/services': ['../../libs/react-native/services/src'],
            '@mas/shared/store': ['../../libs/shared/store/src'],
            '@mas/rn/database': ['../../libs/react-native/database/src'],
            '@mas/shared/config': ['../../libs/shared/config/src'],
            '@mas/shared/types': ['../../libs/shared/types/src'],
            '@mas/react-shared': ['../../libs/react/react-shared/src'],
          },
        },
      ],
    ],
  };
};
