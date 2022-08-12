import type {
  ASTNode,
  ParseFunction,
  ReactNodeOutput,
  ReactOutputRule,
  SingleASTNode
} from 'simple-markdown';

import { cloneElement, createElement } from 'react';

import { nanoid } from '../utils';

export function reach(
  node: ASTNode,
  callback: (node: SingleASTNode) => void
): void {
  if (node) {
    if (Array.isArray(node)) {
      for (const n of node) {
        reach(n, callback);
      }
    } else {
      if (node.content) {
        reach(node.content, callback);
      }

      callback(node);
    }
  } else {
    return;
  }
}

export function blockRender(
  tag: string = 'div',
  className?: string
): ReactOutputRule {
  return {
    react: (node, output, state) =>
      createElement(tag, {
        children: node.content ? output(node.content) : null,
        className: className?.replace('mw-', ''),
        key: state.key?.toString() ?? node.id
      })
  };
}

export function idParse(fn: ParseFunction): ParseFunction {
  return (node, output, state) => {
    const res = fn(node, output, state);
    return { ...res, id: nanoid() };
  };
}

export function idRender(fn: ReactNodeOutput): ReactNodeOutput {
  return (node, output, state) => {
    const res = fn(node, output, state) as JSX.Element | null;
    return res?.props
      ? cloneElement(res, { ...res.props, id: node.id, key: node.id })
      : res;
  };
}
