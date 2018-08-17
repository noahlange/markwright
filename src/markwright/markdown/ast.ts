import Section from '../lib/Section';
import makeCol from '../utils/makeCol';
import makePage from '../utils/makePage';
import reach from '../utils/reach';

/**
 * returns a modified abstract syntax tree more closely representing the final
 * output instead of the markdown document
 * .mw
 *   .section
 *     .page
 *       .header
 *       .body
 *         .content
 *         .footnotes
 *       .pagination
 */

export default function transformAST(
  ast: any,
  flow: Section[] = [],
  columns: number = 2
) {
  // first we have to split the parsed content into regions by h1
  let sections: any[] = [];

  for (const node of ast) {
    let last = sections[sections.length - 1];
    if (node.type === 'heading' && node.level === 1) {
      if ((last && last.title) || !last) {
        // close current section
        sections.push({
          content: [],
          id: sections.length + 1,
          title: node.content,
          type: 'mw-section'
        });
        last = sections[sections.length - 1];
      } else if (last) {
        last.title = node.content;
      }
    }

    if (!last) {
      sections.push({
        content: [node],
        id: 1,
        type: 'mw-section'
      });
    } else {
      last.content.push(node);
    }
  }

  // now that we have our regions, we'll need to split them into pages.
  // if we don't have a flow, we can't do this yet, so we'll just put them
  // all into a single column so it can be flowed.
  if (!flow.length) {
    let page = 0;

    sections = sections.map(s => {
      page++;
      s.content = [
        makePage(
          page,
          {
            content: s.content,
            id: `mw-page-${page}-column-1`,
            type: 'mw-column'
          },
          [],
          s.title
        )
      ];
      return s;
    });
  } else {
    // now that we have our regions AND our flow, we can split things into
    // pages and columns.
    let page = 1;

    sections = sections.map((s, section) => {
      const pages: any[] = [];
      const regions: any[][] = [];
      let correspondingNodeIndex = 0;

      // we're attempting to pair AST nodes to DOM elements
      for (const region of flow[section].regions) {
        const lastRegion = [];
        for (const _ of region.elements) {
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
        const cols = [];
        for (let col = 0; col < columns; col++) {
          cols.push(regions.shift());
        }
        pages.push(cols);
      }

      s.content = pages.map((nodes, p: number) => {
        const footnotes: any[] = [];
        let idx = 1;
        p++; // page number is index + 1
        reach(nodes, (node: any) => {
          if (node.type === 'mw-footnote') {
            node.key = `mw-page-${p}-footnote-${idx++}`;
            footnotes.push({ ...node });
            node.inline = true;
          }
        });
        const cols = nodes
          .filter(n => !!n)
          .map((n: any, i: number) =>
            makeCol(`mw-page-${p}-column-${i + 1}`, n)
          )
          .reduce(
            (a: any[], b: any, i: number) =>
              i === 0
                ? [b]
                : [
                    ...a,
                    {
                      id: `mw-page-${p}-column-separator-${i}`,
                      type: 'mw-column-separator'
                    },
                    b
                  ],
            []
          );
        return makePage(page++, cols, footnotes, s.title);
      });

      return s;
    });
  }

  return sections;
}
