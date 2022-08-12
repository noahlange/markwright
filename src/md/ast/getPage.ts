import type Page from '../../lib/Page';
import type { Section } from '../../lib/Section';
import type { FootnoteData } from './getPageFootnotes';
import type { ASTNode, SingleASTNode } from 'simple-markdown';

export function getPage(
  section: Section,
  page: Page,
  content: ASTNode,
  title: ASTNode,
  footnotes: FootnoteData[]
): SingleASTNode {
  const fnContent = footnotes.map(n => ({ ...n, ...n.node }));

  return {
    id: page.number,
    type: 'mw-page',
    content: [
      {
        type: 'mw-header',
        content: title,
        data: { page, section }
      },
      {
        type: 'mw-body',
        content: [
          { content, type: 'mw-content' },
          {
            content: fnContent,
            id: `mw-page-${page.number}-footnotes`,
            type: 'mw-footnotes'
          }
        ]
      },
      {
        type: 'mw-footer',
        id: `mw-page-${page.number}-footer`,
        data: { page, section },
        content: []
      }
    ]
  };
}
