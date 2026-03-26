import { createContext, useContext } from 'react';

export interface DynCrumb {
  label: string;
  path?: string;
}

type SetDynCrumbs = (crumbs: DynCrumb[] | null) => void;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const DynamicBreadcrumbContext = createContext<SetDynCrumbs>(() => {});

export const useDynamicBreadcrumb = () => useContext(DynamicBreadcrumbContext);
