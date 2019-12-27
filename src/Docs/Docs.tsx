import React, { createContext, useContext, useCallback } from "react";
import { ClassDoc } from "./Documentation";
import { Menu, MenuItemChild } from "./Menu";
import { css } from "emotion";
import { NavigationProvider } from "./Navigation";
import { Page } from "./Page";
import { usePromise } from "./usePromise";

export interface DocsProps {
  path: string;
  rootNamespaces: string[];
  basePath?: string;
  onNavigate: (path: string) => void;
  getClass: (name: string) => Promise<ClassDoc>;
  getSubNamespaces: (
    namespace: string
  ) => Promise<{ subNamespaces: string[]; classes: ClassDoc[] }>;
}

const DocsContext = createContext(null as DocsProps | null);

function useDocsContext(): DocsProps {
  const ctx = useContext(DocsContext);

  if (ctx == null) {
    throw new Error("Must be in DocsContext");
  }

  return ctx;
}

export function useClass(
  name: string
): { isLoading: boolean; error: Error | null; result: ClassDoc | null } {
  const { getClass } = useDocsContext();

  return usePromise(useCallback(() => getClass(name), [getClass]));
}

export function Docs(props: DocsProps) {
  const {
    getSubNamespaces,
    onNavigate,
    path,
    basePath,
    rootNamespaces
  } = props;
  async function getChildren(name: string): Promise<MenuItemChild[]> {
    const { classes, subNamespaces } = await getSubNamespaces(name);

    return [
      ...classes.map(clazz => ({
        name: `${clazz.name.namespace}/${clazz.name.name}`,
        hasChildren: false
      })),

      ...subNamespaces.map(name => ({
        name,
        hasChildren: true
      }))
    ];
  }

  return (
    <DocsContext.Provider value={props}>
      <NavigationProvider
        path={path}
        basePath={basePath}
        onNavigate={onNavigate}
      >
        <div
          className={css`
            display: grid;
            grid-template-columns: auto 1fr;
          `}
        >
          <Menu
            getChildren={getChildren}
            roots={rootNamespaces.map(name => ({ name, hasChildren: true }))}
          />
          <div>
            <Page />
          </div>
        </div>
      </NavigationProvider>
    </DocsContext.Provider>
  );
}
