import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ENV_CONFIG, getActiveEnv } from './env';

// HttpLink reads the active env on every request — no client rebuild needed when env changes.
const httpLink = new HttpLink({
  uri: () => ENV_CONFIG[getActiveEnv()].graphqlUri,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
