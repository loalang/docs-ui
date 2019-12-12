import React from "react";
import { PageHeading } from "@loalang/ui-toolbox/Typography/TextStyle/PageHeading";
import { ClassDoc } from "./Documentation";
import { Menu, MenuItemChild } from "./Menu";
import { css } from "emotion";
import { NavigationProvider, useNavigation } from "./Navigation";

export interface DocsProps {
  path: string;
  onNavigate: (path: string) => void;
  getClass: (name: string) => Promise<ClassDoc>;
  getSubNamespaces: (
    namespace: string
  ) => Promise<{ subNamespaces: string[]; classes: ClassDoc[] }>;
}

export function Docs({ getSubNamespaces, onNavigate, path }: DocsProps) {
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
    <NavigationProvider
      navigation={{
        path,
        navigate: onNavigate
      }}
    >
      <div
        className={css`
          display: grid;
          grid-template-columns: auto 1fr;
        `}
      >
        <Menu
          getChildren={getChildren}
          roots={[{ name: "Loa", hasChildren: true }]}
        />
        <Page />
      </div>
    </NavigationProvider>
  );
}

function Page() {
  const navigation = useNavigation();

  switch (navigation.path) {
    case "":
    case "/":
      return <PageHeading>Home</PageHeading>;

    default:
      return <PageHeading>Not Found</PageHeading>;
  }
}
