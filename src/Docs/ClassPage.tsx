import React, { useEffect } from "react";
import { PageHeading } from "@loalang/ui-toolbox/Typography/TextStyle/PageHeading";
import { Label } from "@loalang/ui-toolbox/Typography/TextStyle/Label";
import { ItemHeading } from "@loalang/ui-toolbox/Typography/TextStyle/ItemHeading";
import { Body } from "@loalang/ui-toolbox/Typography/TextStyle/Body";
import { Basic } from "@loalang/ui-toolbox/Typography/TextStyle/Basic";
import { Heading } from "@loalang/ui-toolbox/Typography/Heading";
import { Section } from "@loalang/ui-toolbox/Typography/Section";
import { Anchor } from "@loalang/ui-toolbox/Anchor";
import { Icon } from "@loalang/ui-toolbox/Icons/Icon";
import {
  TextDoc,
  SignatureDoc,
  TypeDoc,
  ReferenceTypeDoc
} from "./Documentation";
import { useNavigation, Link } from "./Navigation";
import { css } from "emotion";
import { useClass } from "./Docs";

const linkStyle = css`
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;

export function ClassPage() {
  const navigation = useNavigation();
  const { isLoading, error, result } = useClass(navigation.path.slice(1));

  useEffect(() => {
    if (result == null) {
      return;
    }

    const qualifiedName = `${result.name.namespace}/${result.name.name}`;
    if (qualifiedName !== navigation.path) {
      history.replaceState(
        null,
        document.title,
        `/${qualifiedName}${location.hash}`
      );
    }
  }, [result]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error != null) {
    return <PageHeading>{error.message}</PageHeading>;
  }

  return (
    <Section>
      <article
        className={css`
          color: #333;
          margin: 2em;
          & > * {
            margin: 0.6em 0;
          }
        `}
      >
        <Heading>
          <Label>Class</Label>
          <PageHeading>{result!.name.name}</PageHeading>
        </Heading>

        <Section>
          <div
            className={css`
              display: grid;
              gap: 1em;
              grid-template-columns: auto 1fr;
            `}
          >
            {result!.superTypes.length > 0 && (
              <Section>
                <div>
                  <Heading>
                    <Label>Super Types</Label>
                  </Heading>
                  <ul>
                    {result!.superTypes.map((type, i) => (
                      <li key={i}>
                        <Basic>
                          <Type type={type} />
                        </Basic>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            )}

            {result!.subClasses.length > 0 && (
              <Section>
                <div>
                  <Heading>
                    <Label>Sub Classes</Label>
                  </Heading>
                  <ul>
                    {result!.subClasses.map(class_ => (
                      <li key={class_}>
                        <Basic>
                          <Link className={linkStyle} to={`/${class_}`}>
                            <QualifiedName>{class_}</QualifiedName>
                          </Link>
                        </Basic>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>
            )}
          </div>
        </Section>

        <RichDoc text={result!.description} />

        {Object.values(result!.behaviours).map((behaviour, i) => (
          <Section key={i}>
            <Heading>
              <div
                className={css`
                  display: grid;
                  grid-template-columns: auto auto 1fr;
                  grid-gap: 7px;
                `}
              >
                <ItemHeading>
                  <Signature signature={behaviour.signature} />
                </ItemHeading>
                <Anchor name={behaviour.selector} margin={10} />
              </div>
            </Heading>

            <RichDoc text={behaviour.description} />
          </Section>
        ))}
      </article>
    </Section>
  );
}

function Signature({ signature }: { signature: SignatureDoc }) {
  switch (signature.__type) {
    case "UNARY":
      return (
        <>
          {signature.symbol} <Icon.ArrowForward />{" "}
          <Type type={signature.returnType} />
        </>
      );
    case "BINARY":
      return (
        <>
          {signature.operator} <Type type={signature.operandType} />{" "}
          <Icon.ArrowForward /> <Type type={signature.returnType} />
        </>
      );
    case "KEYWORD":
      return (
        <>
          {signature.parameters.map(param => (
            <span key={param.keyword}>
              {param.keyword}: <Type type={param.type} />{" "}
            </span>
          ))}
          <Icon.ArrowForward /> <Type type={signature.returnType} />
        </>
      );
  }
}

function Type({ type }: { type: TypeDoc }) {
  switch (type.__type) {
    case "REFERENCE": {
      return <ReferenceType type={type} />;
    }
  }
}

function ReferenceType({ type }: { type: ReferenceTypeDoc }) {
  const { result } = useClass(type.class);

  const args =
    type.arguments.length === 0 ? (
      <></>
    ) : (
      <>
        &lt;
        {type.arguments.map((arg, i) => {
          return (
            <>
              {i === 0 ? "" : ", "}
              <Type type={arg} />
            </>
          );
        })}
        &gt;
      </>
    );

  if (result == null) {
    return (
      <>
        <QualifiedName>{type.class}</QualifiedName>
        {args}
      </>
    );
  }

  return (
    <>
      <Link
        className={linkStyle}
        to={`/${result.name.namespace}/${result.name.name}`}
      >
        <QualifiedName>{`${result.name.namespace}/${result.name.name}`}</QualifiedName>
      </Link>
      {args}
    </>
  );
}

function QualifiedName({ children }: { children: string }) {
  const segments = children.split("/");
  const name = segments.pop();
  const namespace = segments.join("/").replace(/@[^/]+/g, "");

  const { path } = useNavigation();

  const isLocalName =
    namespace === "Loa" ||
    namespace ===
      path
        .split("/")
        .slice(1, -1)
        .join("/")
        .replace(/@[^/]+/g, "");

  return (
    <>
      {!isLocalName && (
        <span
          className={css`
            opacity: 0.6;
          `}
        >
          {namespace}/
        </span>
      )}
      {name}
    </>
  );
}

function RichDoc({ text }: { text: TextDoc }) {
  return (
    <>
      {text.blocks.map((block, i) => {
        switch (block.__type) {
          case "PARAGRAPH":
            return (
              <p key={i}>
                <Body>
                  {block.elements.map((element, j) => {
                    switch (element.__type) {
                      case "TEXT":
                        return <span key={j}>{element.value}</span>;

                      case "BOLD":
                        return (
                          <span
                            key={j}
                            className={css`
                              font-weight: bold;
                            `}
                          >
                            {element.value}
                          </span>
                        );

                      case "ITALIC":
                        return (
                          <span
                            key={j}
                            className={css`
                              font-style: italic;
                            `}
                          >
                            {element.value}
                          </span>
                        );

                      case "LINK":
                        return (
                          <a key={j} className={linkStyle} href={element.to}>
                            {element.value}
                          </a>
                        );
                    }
                  })}
                </Body>
              </p>
            );
        }
      })}
    </>
  );
}
