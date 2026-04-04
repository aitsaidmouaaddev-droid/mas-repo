export type AppEnv = 'dev' | 'prod';

export const ENV_STORAGE_KEY = 'bo-env';

export const ENV_CONFIG: Record<AppEnv, { label: string; graphqlUri: string }> = {
  dev: {
    label: 'Development',
    graphqlUri: '/graphql', // proxied to localhost:4444 by vite
  },
  prod: {
    label: 'Production',
    graphqlUri: 'https://mas-videos-generator.azurewebsites.net/graphql',
  },
};

export function getActiveEnv(): AppEnv {
  const stored = localStorage.getItem(ENV_STORAGE_KEY);
  return stored === 'prod' ? 'prod' : 'dev';
}

export function setActiveEnv(env: AppEnv): void {
  localStorage.setItem(ENV_STORAGE_KEY, env);
}
