import React, { createContext, useContext, ReactNode } from "react";

export interface Navigation {
  path: string;
  navigate: (path: string) => void;
}

const NavigationContext = createContext<Navigation | null>(null);

export function NavigationProvider({
  navigation,
  children
}: {
  navigation: Navigation;
  children: ReactNode;
}) {
  return (
    <NavigationContext.Provider value={navigation}>
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

  return (
    <a
      className={className}
      href={to}
      onClick={e => {
        e.preventDefault();
        navigation.navigate(to);
      }}
    >
      {children}
    </a>
  );
}
