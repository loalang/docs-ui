import ReactDOM from "react-dom";
import React from "react";
import { Docs } from "../Docs/Docs";
import { Documentation, ClassDoc } from "../Docs/Documentation";
import { Reset } from "@loalang/ui-toolbox/Reset";
import { Router } from "@reach/router";

const MOCK_DOCS: Documentation = {
  classes: {
    "Loa/Some/Class/Here": {
      name: {
        name: "Here",
        namespace: "Loa/Some/Class"
      },
      subClasses: [],
      superClasses: [],
      behaviours: {
        "do:thing:": {
          selector: "do:thing:"
        }
      }
    },
    "My/Package/Class/Here": {
      name: {
        name: "Here",
        namespace: "My/Package/Class"
      },
      subClasses: [],
      superClasses: [],
      behaviours: {}
    }
  }
};

function App({
  localDocs = MOCK_DOCS,
  "*": uri,
  navigate
}: {
  path: string;
  navigate?: (to: string) => void;
  "*"?: string;
  localDocs?: Documentation;
}) {
  const rootNamespaces = new Set<string>();

  for (const className in localDocs.classes) {
    if (localDocs.classes.hasOwnProperty(className)) {
      rootNamespaces.add(className.split("/").shift()!);
    }
  }

  return (
    <Reset>
      <Docs
        rootNamespaces={Array.from(rootNamespaces)}
        path={uri!}
        onNavigate={navigate!}
        getClass={async name => {
          if (name in localDocs.classes) {
            return localDocs.classes[name];
          }
          throw new Error(`Class not found: ${name}`);
        }}
        getSubNamespaces={async name => {
          const segments = name.split("/").length;

          const classes: ClassDoc[] = [];
          const subNamespaces = new Set<string>();

          for (const qn in localDocs.classes) {
            if (
              localDocs.classes.hasOwnProperty(qn) &&
              qn.startsWith(`${name}/`)
            ) {
              const qnn = qn.split("/");
              if (qnn.length === segments + 1) {
                classes.push(localDocs.classes[qn]);
              } else {
                subNamespaces.add(qnn.slice(0, segments + 1).join("/"));
              }
            }
          }

          return {
            classes,
            subNamespaces: Array.from(subNamespaces)
          };
        }}
      />
    </Reset>
  );
}

fetch("/docs.json")
  .then(response => response.json())
  .catch(() => undefined)
  .then(docs =>
    ReactDOM.render(
      <Router>
        <App path="/*" localDocs={docs} />
      </Router>,
      document.getElementById("root")
    )
  );
