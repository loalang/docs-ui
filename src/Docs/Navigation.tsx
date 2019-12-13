import React, { createContext, useContext, ReactNode } from "react";

export interface Navigation {
  path: string;
  basePath: string;
  navigate: (path: string) => void;
}

const NavigationContext = createContext<Navigation | null>(null);

export function NavigationProvider({
  path,
  basePath = "",
  onNavigate,
  children
}: {
  path: string;
  basePath?: string;
  onNavigate: (path: string) => void;
  children: ReactNode;
}) {
  const basePathSegments = basePath.split("/").filter(Boolean);
  const pathSegments = path
    .split("/")
    .filter(Boolean)
    .slice(basePathSegments.length);

  return (
    <NavigationContext.Provider
      value={{
        basePath:
          basePathSegments.length === 0
            ? "/"
            : `/${basePathSegments.join("/")}/`,
        path: `/${pathSegments.join("/")}`,
        navigate: onNavigate
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): Navigation {
  const navigation = useContext(NavigationContext);

  if (navigation == null) {
    throw new Error("Cannot useNavigation outside of a NavigationProvider.");
  }

  return navigation;
}

export function Link({
  children,
  to,
  className
}: {
  children: ReactNode;
  to: string;
  className?: string;
}) {
  const navigation = useNavigation();
  const href = to.startsWith("/") ? `${navigation.basePath}${to.slice(1)}` : to;
  return (
    <a
      className={className}
      href={href}
      onClick={e => {
        e.preventDefault();
        console.log(href);
        navigation.navigate(href);
      }}
    >
      {children}
    </a>
  );
}
