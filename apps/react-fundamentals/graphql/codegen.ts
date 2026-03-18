import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'graphql/schema.gql',
  documents: ['src/**/*.graphql', 'src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    '../../libs/react-fundamentals/sot/src/graphql.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        outputAs: 'interface',
        skipTypename: true,
      },
    },
  },
};

export default config;
