import type { SingleASTNode } from 'simple-markdown';

import { getNodes } from '../utils';

export interface FootnoteData {
  number: number;
  anchor: string;
  node: SingleASTNode;
}

export function getPageFootnotes(
  allFootnotes: SingleASTNode[],
  pageNodes: SingleASTNode[]
): FootnoteData[] {
  const footnotes: Record<string, SingleASTNode> = allFootnotes.reduce(
    (a, b) => ({ ...a, [b.anchor]: b }),
    {}
  );

  let count = 0;
  const anchors: Record<string, number> = {};
  for (const node of getNodes('mw-footnote', pageNodes)) {
    if (node.inline) {
      node.number = ++count;
      anchors[node.anchor] = node.number;
    }
  }

  return Object.entries(anchors).map(([id, number]) => ({
    node: footnotes[id],
    anchor: id,
    number
  }));
}
