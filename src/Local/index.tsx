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

function App() {
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
          if (name in MOCK_DOCS.classes) {
            return MOCK_DOCS.classes[name];
          }
          throw new Error(`Class not found: ${name}`);
        }}
        getSubNamespaces={async name => {
          const segments = name.split("/").length;

          const classes: ClassDoc[] = [];
          const subNamespaces = new Set<string>();

          for (const qn in MOCK_DOCS.classes) {
            if (
              MOCK_DOCS.classes.hasOwnProperty(qn) &&
              qn.startsWith(`${name}/`)
            ) {
              const qnn = qn.split("/");
              if (qnn.length === segments + 1) {
                classes.push(MOCK_DOCS.classes[qn]);
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

ReactDOM.render(<App />, document.getElementById("root"));
