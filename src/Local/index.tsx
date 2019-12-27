import ReactDOM from "react-dom";
import React from "react";
import { Docs } from "../Docs/Docs";
import { Documentation, ClassDoc } from "../Docs/Documentation";
import { Reset } from "@loalang/ui-toolbox/Reset";
import { Router } from "@reach/router";

const MOCK_DOCS: Documentation = {
  classes: {
    "Loa@1.1.0/Some/Class/Here": {
      name: {
        name: "Here",
        namespace: "Loa@1.1.0/Some/Class"
      },
      description: {
        blocks: [
          {
            __type: "PARAGRAPH",
            elements: [
              {
                __type: "TEXT",
                value: "Hello "
              },
              {
                __type: "BOLD",
                value: "there"
              },
              {
                __type: "TEXT",
                value: " friend"
              }
            ]
          },
          {
            __type: "PARAGRAPH",
            elements: [
              {
                __type: "TEXT",
                value: "Click "
              },
              {
                __type: "LINK",
                value: "here",
                to: "/"
              }
            ]
          }
        ]
      },
      subClasses: [],
      superTypes: [],
      behaviours: {
        "do:thing:": {
          selector: "do:thing:",
          signature: {
            __type: "KEYWORD",
            parameters: [
              {
                keyword: "do",
                type: {
                  __type: "REFERENCE",
                  class: "Loa@1.1.0/Some/Class/Here",
                  arguments: []
                }
              },
              {
                keyword: "thing",
                type: {
                  __type: "REFERENCE",
                  class: "My/Package@1.1.0/Class/Here",
                  arguments: []
                }
              }
            ],
            returnType: {
              __type: "REFERENCE",
              class: "Loa@1.1.0/Some/Class/Here",
              arguments: []
            }
          },
          description: {
            blocks: [
              {
                __type: "PARAGRAPH",
                elements: [
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  }
                ]
              }
            ]
          }
        },
        "doOther:thing:": {
          selector: "doOther:thing:",
          signature: {
            __type: "KEYWORD",
            parameters: [
              {
                keyword: "doOther",
                type: {
                  __type: "REFERENCE",
                  class: "Loa@1.1.0/Some/Class/Here",
                  arguments: []
                }
              },
              {
                keyword: "thing",
                type: {
                  __type: "REFERENCE",
                  class: "Loa@1.1.0/Some/Class/Here",
                  arguments: []
                }
              }
            ],
            returnType: {
              __type: "REFERENCE",
              class: "Loa@1.1.0/Some/Class/Here",
              arguments: []
            }
          },
          description: {
            blocks: [
              {
                __type: "PARAGRAPH",
                elements: [
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  },
                  {
                    __type: "TEXT",
                    value:
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  }
                ]
              }
            ]
          }
        }
      }
    },
    "My/Package@1.1.0/Class/Here": {
      name: {
        name: "Here",
        namespace: "My/Package@1.1.0/Class"
      },
      description: { blocks: [] },
      superTypes: [],
      subClasses: [],
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
          const cleanName = name.replace(/@[^/]+/g, "");
          for (const className in localDocs.classes) {
            if (localDocs.classes.hasOwnProperty(className)) {
              const cleanExistingName = className.replace(/@[^/]+/g, "");

              if (cleanExistingName === cleanName) {
                return localDocs.classes[className];
              }
            }
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
