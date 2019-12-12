import React, { useState, useEffect } from "react";
import { css, cx } from "emotion";
import { Icon } from "@loalang/ui-toolbox/Icons/Icon";
import { Link } from "./Navigation";

export function Menu({
  getChildren,
  roots
}: {
  getChildren: (name: string) => Promise<MenuItemChild[]>;
  roots: MenuItemChild[];
}) {
  return (
    <div
      className={css`
        background: #f4f5f9;
        width: 30vw;
        max-width: 300px;
      `}
    >
      {roots.map(root => (
        <MenuItem
          level={0}
          name={root.name}
          hasChildren={root.hasChildren}
          getChildren={getChildren}
        />
      ))}
    </div>
  );
}

export interface MenuItemChild {
  name: string;
  hasChildren: boolean;
}

interface MenuItemProps {
  name: string;
  level: number;
  hasChildren: boolean;
  getChildren: (name: string) => Promise<MenuItemChild[]>;
}

const FOCUS = css`
  &:hover,
  &:hover + * {
    background: #ebecfa;
  }

  &:focus {
    outline: 0;

    color: #fff;
    background: #1111ff;
  }
`;

function MenuItem({ name, hasChildren, getChildren, level }: MenuItemProps) {
  const [error, setError] = useState(null as Error | null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState([] as MenuItemChild[]);

  useEffect(() => {
    if (!isLoading && isExpanded && children.length === 0) {
      setIsLoading(true);
      (async () => {
        try {
          setChildren(await getChildren(name));
        } catch (e) {
          setError(e);
          setIsExpanded(false);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [name, children, getChildren, isExpanded]);

  return (
    <div
      className={css`
        line-height: 1;
        background: transparent;
      `}
    >
      {hasChildren ? (
        <button
          className={cx(
            FOCUS,
            css`
              padding: 3px;
              padding-left: ${(level + 1) * 15}px;
              width: 100%;
              text-align: left;
              display: flex;
              cursor: pointer;
            `
          )}
          disabled={isLoading}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div>{name.split("/").pop()}</div>
          <div
            className={css`
              transition: 300ms transform;
              background: transparent;
              transform: rotate(${isExpanded ? "90deg" : "0deg"});
              border-radius: 0.5em;
              height: 1em;
              width: 1em;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <Icon.ChevronRight />
          </div>
        </button>
      ) : (
        <Link
          className={cx(
            FOCUS,
            css`
              padding: 3px;
              padding-left: ${(level + 1) * 15}px;
              display: block;
            `
          )}
          to={`/${name}`}
        >
          {name.split("/").pop()}
        </Link>
      )}
      {error && <div>{error.message}</div>}
      <ul style={{ display: isExpanded ? "block" : "none" }}>
        {children.map(({ name, hasChildren }, i) => (
          <li key={i}>
            <MenuItem
              key={i}
              name={name}
              hasChildren={hasChildren}
              getChildren={getChildren}
              level={level + 1}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
