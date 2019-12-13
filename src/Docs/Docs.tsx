import React, { useState, useEffect, useCallback } from "react";
import { PageHeading } from "@loalang/ui-toolbox/Typography/TextStyle/PageHeading";
import { ClassDoc } from "./Documentation";
import { Menu, MenuItemChild } from "./Menu";
import { css } from "emotion";
import { NavigationProvider, useNavigation } from "./Navigation";

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

export function Docs({
  getSubNamespaces,
  onNavigate,
  path,
  basePath,
  rootNamespaces,
  getClass
}: DocsProps) {
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
    <NavigationProvider path={path} basePath={basePath} onNavigate={onNavigate}>
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
        <Page getClass={getClass} />
      </div>
    </NavigationProvider>
  );
}

function usePromise<T>(
  getPromise: () => Promise<T>
): { isLoading: boolean; error: Error | null; result: T | null } {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState(null as T | null);
  const [error, setError] = useState(null as Error | null);

  useEffect(() => {
    setError(null);
    setIsLoading(true);
    getPromise()
      .then(setResult)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [getPromise]);

  return { result, isLoading, error };
}

function Page({ getClass }: { getClass: (name: string) => Promise<ClassDoc> }) {
  const navigation = useNavigation();

  if (navigation.path === "/") {
    return <>Home</>;
  }

  return <ClassPage getClass={getClass} />;
}

function ClassPage({
  getClass
}: {
  getClass: (name: string) => Promise<ClassDoc>;
}) {
  const navigation = useNavigation();

  const { isLoading, error, result } = usePromise(
    useCallback(() => getClass(navigation.path.slice(1)), [
      getClass,
      navigation.path
    ])
  );

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error != null) {
    return <PageHeading>{error.message}</PageHeading>;
  }

  return <PageHeading>{result!.name.name}</PageHeading>;
}
