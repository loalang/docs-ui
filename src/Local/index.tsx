import ReactDOM from "react-dom";
import React, { useState } from "react";
import { Docs } from "../Docs/Docs";
import { Documentation, ClassDoc } from "../Docs/Documentation";
import { Reset } from "@loalang/ui-toolbox/Reset";

const MOCK_DOCS: Documentation = {
  classes: {
    "Loa/Some/Class/Here": {
      name: {
        name: "Here",
        namespace: "Some/Class"
      },
      subClasses: [],
      superClasses: [],
      behaviours: {
        "do:thing:": {
          selector: "do:thing:"
        }
      }
    }
  }
};

function App({ localDocs = MOCK_DOCS }: { localDocs?: Documentation }) {
  const [, forceUpdate] = useState({});

  return (
    <Reset>
      <Docs
        path={location.hash}
        onNavigate={path => {
          location.hash = path;
          forceUpdate({});
        }}
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
    ReactDOM.render(<App localDocs={docs} />, document.getElementById("root"))
  );
