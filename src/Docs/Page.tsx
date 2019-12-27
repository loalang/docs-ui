import React from "react";
import { useNavigation } from "./Navigation";
import { ClassPage } from "./ClassPage";

export function Page() {
  const navigation = useNavigation();

  if (navigation.path === "/") {
    return <>Home</>;
  }

  return <ClassPage />;
}
