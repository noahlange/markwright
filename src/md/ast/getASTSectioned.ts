import type { SingleASTNode } from 'simple-markdown';

import { nanoid } from '../../utils';
import { getNodes } from '../utils';

function getSection(content: SingleASTNode[]): SingleASTNode | null {
  if (content.length) {
    return {
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
            content
          }
        }
      }
    };
  }
  return null;
}

export function getASTSectioned(ast: SingleASTNode[]): SingleASTNode[] {
  const sections: (SingleASTNode | null)[] = [];

  let start = 0;
  for (const node of getNodes('heading', ast)) {
    if (node.level === 1) {
      const end = ast.indexOf(node);
      sections.push(getSection(ast.slice(start, end)));
      start = end;
    }
  }

  sections.push(getSection(ast.slice(start)));

  return sections.filter(node => node !== null) as SingleASTNode[];
}
