import Region from '../lib/Region';
import Section from '../lib/Section';

import makeCol from '../utils/makeCol';
import makePage from '../utils/makePage';
import reach from '../utils/reach';

/**
 * returns a modified abstract syntax tree more closely representing the final
 * output instead of the markdown document
 * .mw
 *   .mw-section
 *     .mw-page
 *       .mw-header
 *       .mw-body
 *         .mw-content
 *         .mw-footnotes
 *       .mw-pagination
 */
export default function transformAST(ast, flow: Section[] = []) {
  // first we have to split the parsed content into regions by h1
  let sections: any[] = [];
  const titles: string[] = []

  for (const node of ast) {
    let last = sections[sections.length - 1];
    if (node.type === 'heading' && node.level === 1) {
      // close current section
      sections.push({
        content: [],
        id: sections.length + 1,
        type: 'mw-section'
      });
      last = sections[sections.length - 1];
      titles.push(node.content);
    }
    if (!last) {
      sections.push({ content: [ node ], id: 1, type: 'mw-section' });
    } else {
      last.content.push(node);
    }
  }

  // now that we have our regions, we'll need to split them into pages.
  // if we don't have a flow, we can't do this yet, so we'll just put them
  // all into a single column so it can be flowed.
  if (!flow.length) {
    let page = 0;

    sections = sections.map((s, i) => {
      page++;
      s.content = makePage(
        page,
        {
          content: s.content,
          id: `page-${page}-column-1`,
          type: 'mw-column'
        },
        [],
        titles[i]
      );
      return s;
    });
  } else {
    // now that we have our regions AND our flow, we can split things into
    // pages and columns.
    let page = 1;

    sections = sections.map((s, section) => 
{
      const pages = [];
      const regions: any[][] = [];
      let correspondingNodeIndex = 0;

      // we're attempting to pair AST nodes to DOM elements
      for (const region of flow[section].regions) {
        const lastRegion = [];
        for (const element of region.elements) {
          let pushedContentfulNode = false;
          while (!pushedContentfulNode) {
            const correspondingNodeFromAST = s.content[correspondingNodeIndex];
            if (!correspondingNodeFromAST) {
              pushedContentfulNode = true;
            } else {
              lastRegion.push(correspondingNodeFromAST);
              correspondingNodeIndex++;
              if (correspondingNodeFromAST.type === 'newline') {
                continue;
              } else {
                pushedContentfulNode = true;
              }
            }
          }
        }
        // out of nodes for this region
        regions.push(lastRegion);
      }

      while (regions.length) {
        // two columns, hardcoded
        pages.push([ regions.shift(), regions.shift() ]);
      }

      s.content = pages.map(nodes => {
        const footnotes = [];
        let idx = 1;
        reach(nodes, node => {
          if (node.type === 'mw-footnote') {
            node.id = idx++;
            footnotes.push(node);
            node.inline = true;
          }
        });
        const cols = nodes
          .filter(f => !!f)
          .map(n => makeCol(n))
          .reduce(
            (a, b, i) =>
              i === 0 ? [b] : [...a, { type: 'mw-column-separator' }, b],
            []
          );
        return makePage(page++, cols, footnotes, titles[section]);
      });

      return s;
    });
  }

  return [{ type: 'mw', content: sections }];
}
