import type { SingleASTNode } from 'simple-markdown';

import { flow } from '../../lib/flow';
import { getNodes } from '../../tests/helpers/ast';
import { nanoid } from '../../utils';
import { getPage } from './getPage';
import { getPageFootnotes } from './getPageFootnotes';

export function getSectionedAST(ast: SingleASTNode[]): SingleASTNode[] {
  const sections: SingleASTNode[] = [];
  let items: SingleASTNode[] = [];

  for (const node of ast) {
    if (
      (node.type === 'heading' && node.level === 1) ||
      ast.indexOf(node) === ast.length - 1
    ) {
      sections.push({
        type: 'mw-section',
        id: nanoid(),
        content: {
          type: 'mw-page',
          id: nanoid(),
          content: {
            type: 'mw-body',
            id: nanoid(),
            content: {
              type: 'mw-content',
              id: nanoid(),
              content: items
            }
          }
        }
      });
      items = [];
    }
    items.push(node);
  }
  return sections.slice(1);
}

export function getFlowedAST(
  ast: SingleASTNode[],
  container: HTMLDivElement
): SingleASTNode[] {
  return flow(container).map(section => {
    const title = ast
      .filter(
        node =>
          section.ids.includes(node.id) &&
          node.type === 'heading' &&
          node.level === 1
      )
      .flatMap(item => item.content);

    return {
      type: 'mw-section',
      id: section.number,
      content: section.pages.map(page => {
        const ids = page.ids;
        const content = ast.filter(node => ids.includes(node.id));
        return getPage(
          section,
          page,
          content,
          title,
          getPageFootnotes(
            getNodes('mw-footnote', ast).filter(fn => !fn.inline),
            content
          )
        );
      })
    };
  });
}
