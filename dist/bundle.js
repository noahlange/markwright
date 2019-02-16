import React from 'react';
import {
  defaultRules,
  blockRegex,
  inlineRegex,
  parserFor,
  ruleOutput,
  reactFor
} from 'simple-markdown';
import Async from 'react-promise';

class Region {
  constructor() {
    this.elements = [];
  }
  get size() {
    return this.elements.length;
  }
  get height() {
    const i = v => (v ? parseInt(v, 10) : 0);
    let [sum, bottom] = [0, 0];
    for (const node of this.elements) {
      const { height } = node.getBoundingClientRect();
      const s = getComputedStyle(node);
      // get margins for current node.
      const m = { bottom: i(s.marginBottom), top: i(s.marginTop) };
      // add whichever is bigger, the bottom margin of the previous node or the
      // top margin of the current node. collapsing margins, hooray!
      sum += height + Math.max(bottom, m.top);
      bottom = m.bottom;
    }
    return sum;
  }
  add(element) {
    this.elements.push(element);
  }
}

class Section {
  constructor() {
    this.regions = [];
  }
  add(region) {
    this.regions.push(region);
  }
}

function makeCol(id, nodes) {
  return {
    content: nodes,
    id,
    type: 'mw-column'
  };
}

function makePage(
  page,
  columns,
  footnotes,
  header = [{ type: 'text', content: [] }]
) {
  return {
    content: [
      {
        content: header,
        id: `mw-page-${page}-header`,
        type: 'mw-header'
      },
      {
        content: [
          {
            content: columns,
            id: `mw-page-${page}-content`,
            type: 'mw-content'
          },
          {
            content: footnotes.map(f =>
              Object.assign({}, f, { inline: false })
            ),
            id: `mw-page-${page}-footnotes`,
            type: 'mw-footnotes'
          }
        ],
        id: `mw-page-${page}-body`,
        type: 'mw-body'
      }
    ],
    id: page,
    type: 'mw-page'
  };
}

function recursiveForEach(node, callback) {
  if (node) {
    if (Array.isArray(node)) {
      for (const n of node) {
        recursiveForEach(n, callback);
      }
    } else {
      callback(node);
      if (node.content) {
        for (const n of node.content) {
          recursiveForEach(n, callback);
        }
      }
    }
  }
}

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
function isHeadingNode(n) {
  return n.type === 'heading';
}
function transformAST(ast, flow = [], columns = 2) {
  // first we have to split the parsed content into regions by h1
  let sections = [];
  for (const node of ast) {
    let last = sections[sections.length - 1];
    if (isHeadingNode(node)) {
      if (node.level === 1) {
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
      const pages = [];
      const regions = [];
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
      s.content = pages.map((nodes, p) => {
        const footnotes = [];
        let idx = 1;
        p++; // page number is index + 1
        recursiveForEach(nodes, node => {
          if (node.type === 'mw-footnote') {
            node.key = `mw-page-${p}-footnote-${idx++}`;
            footnotes.push(Object.assign({}, node));
            node.inline = true;
          }
        });
        const cols = nodes
          .filter(n => !!n)
          .map((n, i) => makeCol(`mw-page-${p}-column-${i + 1}`, n))
          .reduce(
            (a, b, i) =>
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

function divOf(str, tag = 'div') {
  return {
    react(node, output, state) {
      return React.createElement(tag, {
        children: output(node.content),
        className: str.replace('mw-', ''),
        key: node.id || state.key
      });
    }
  };
}

var rules = ({ highlight }) => {
  return Object.assign({}, defaultRules, {
    blockQuote: Object.assign({}, defaultRules.blockQuote, {
      match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n/)
    }),
    codeBlock: Object.assign({}, defaultRules.codeBlock, {
      react(node, _, state) {
        const content = highlight
          ? highlight(node.content, node.lang)
          : Promise.resolve(node.content);
        return React.createElement(
          'div',
          { key: state.key },
          React.createElement(Async, {
            promise: content,
            pending: () =>
              React.createElement(
                'pre',
                null,
                React.createElement('code', null, node.content)
              ),
            then: v => {
              return React.createElement(
                'pre',
                { className: `lang lang-${node.lang}` },
                React.createElement('code', {
                  dangerouslySetInnerHTML: { __html: v }
                })
              );
            }
          })
        );
      }
    }),
    heading: Object.assign({}, defaultRules.heading, {
      // adjusted so empty lines aren't required after headings
      match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)
    }),
    mw: {
      react(node, output) {
        return React.createElement(
          'div',
          { className: 'mw', key: `mw-${node.id}` },
          output(node.content)
        );
      }
    },
    'mw-block': {
      match: blockRegex(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),
      order: 0,
      parse(capture, recurseParse, state) {
        if (!state.blocks) {
          state.blocks = 1;
        }
        return {
          block: capture[2],
          // hacky hack hack; we need to parse the contents for block-level
          // items, so we'll wrap it in newlines until the parser's happy
          content: recurseParse(
            `\n\n${capture[3]}\n\n`,
            { inline: false },
            state
          ),
          id: state.blocks++
        };
      },
      react(node, output) {
        return React.createElement(
          'div',
          { key: node.id, className: `block ${node.block}` },
          output(node.content)
        );
      }
    },
    'mw-body': divOf('mw-body'),
    'mw-break': {
      match: blockRegex(/^\{\.break\}/),
      order: 0,
      parse(_capture, _recurseParse, state) {
        if (!state.breaks) {
          state.breaks = 1;
        }
        return { id: state.breaks++ };
      },
      react(node) {
        return React.createElement('div', {
          key: `mw-break-${node.id}`,
          className: 'break'
        });
      }
    },
    'mw-column': divOf('mw-column'),
    'mw-column-separator': {
      react(node) {
        return React.createElement('hr', {
          key: node.id,
          className: 'column-separator'
        });
      }
    },
    'mw-content': divOf('mw-content'),
    'mw-footnote': {
      match: inlineRegex(/^\^\[(.+?)\]/),
      order: defaultRules.link.order - 1,
      parse(capture, recurseParse, state) {
        if (!state.footnotes) {
          state.footnotes = 1;
        }
        return {
          content: recurseParse(capture[1], state),
          id: state.footnotes++
        };
      },
      react(node, output) {
        return node.inline
          ? React.createElement('sup', { key: `${node.id}-inline` }, node.id)
          : React.createElement(
              'span',
              { key: node.id, className: 'footnote' },
              node.id,
              '. ',
              output(node.content)
            );
      }
    },
    'mw-footnotes': {
      react(node, output) {
        const str = `footnotes ${
          node.content && node.content.length ? '' : 'empty'
        }`;
        return React.createElement(
          'div',
          { key: `mw-footnote-${node.id}`, className: str },
          output(node.content)
        );
      }
    },
    'mw-header': divOf('mw-header'),
    'mw-page': {
      react(node, output) {
        const even = node.id % 2 ? 'odd' : 'even';
        return React.createElement(
          'div',
          {
            key: `mw-page-${node.id}`,
            className: `page page-${node.id} ${even}`
          },
          React.createElement(
            React.Fragment,
            null,
            output(node.content),
            React.createElement(
              'div',
              { key: `mw-page-${node.id}-pagination`, className: 'pagination' },
              node.id
            )
          )
        );
      }
    },
    'mw-section': {
      react(node, output) {
        return React.createElement(
          'div',
          {
            key: `mw-section-${node.id}`,
            className: `section section-${node.id}`
          },
          output(node.content)
        );
      }
    },
    paragraph: Object.assign({}, defaultRules.paragraph, {
      react(node, output, state) {
        return React.createElement(
          'p',
          { key: `p-${state.key}` },
          output(node.content)
        );
      }
    })
  });
};

class Markwright extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      content: this.props.value,
      flowed: false,
      regions: [],
      style: `
      .unflowed .footnote { display: block; }
    `
    };
  }
  static react(content, regions, columns, highlight) {
    const r = this.rules ? this.rules : (this.rules = rules({ highlight }));
    const parser = parserFor(r);
    const tree = parser(content);
    const output = ruleOutput(r, 'react');
    const render = reactFor(output);
    const sections = transformAST(tree, regions, columns);
    return render(sections);
  }
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.content) {
      return {
        content: props.value,
        flowed: false,
        regions: []
      };
    } else if (props.flowed) {
      return { flowed: true, regions: props.regions };
    }
    return null;
  }
  static flow(manual) {
    const sections = [];
    if (this.ref) {
      // approximate additional height of the footnote block, sans footnotes.
      const FOOTNOTE_BLOCK_HEIGHT = 48;
      for (const page of this.ref.querySelectorAll('.page')) {
        const section = new Section();
        // should only be one page / column for an unflowed section
        const column = page.querySelector('.column');
        if (column) {
          const height =
            column.getBoundingClientRect().height - FOOTNOTE_BLOCK_HEIGHT;
          // sliced are all the HTML elements in our unflowed mega-column
          const sliced = [].slice.call(column.children);
          let region = new Region();
          for (const node of sliced) {
            if (node.classList.contains('break')) {
              section.add(region);
              region = new Region();
              region.add(node);
            } else {
              region.add(node);
              if (!manual && region.height > height) {
                region.elements.pop();
                section.add(region);
                region = new Region();
                region.add(node);
              }
            }
          }
          section.add(region);
          sections.push(section);
        }
      }
    }
    return sections;
  }
  reflow() {
    if (!this.state.flowed) {
      this.props.onFlow(Markwright.flow(this.props.manual));
    }
  }
  componentDidUpdate() {
    this.reflow();
  }
  componentDidMount() {
    this.reflow();
  }
  render() {
    return React.createElement(
      'div',
      {
        className: this.state.flowed ? '' : 'unflowed',
        ref: e => (Markwright.ref = e)
      },
      React.createElement('style', { type: 'text/css' }, this.state.style),
      Markwright.react(
        // @todo - hack to stop the page from disappearing.
        this.state.content || ' ',
        this.state.regions,
        this.props.columns,
        this.props.highlight
      )
    );
  }
}
Markwright.ref = null;

var valueful = v => v !== undefined && v !== null;

class index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = { flowed: false, regions: [] };
  }
  config(key, fallback) {
    return this.props.config
      ? valueful(this.props.config[key])
        ? this.props.config[key]
        : fallback
      : fallback;
  }
  render() {
    return React.createElement(Markwright, {
      value: this.props.value,
      page: this.config('page', { width: 96 * 8.5, height: 96 * 11 }),
      manual: this.config('manual', true),
      columns: this.config('manual', true) ? 1 : this.config('columns', 2),
      highlight: this.config('highlight'),
      flowed: this.state.flowed,
      regions: this.state.regions,
      onFlow: r => this.setState({ flowed: true, regions: r })
    });
  }
}

export default index;
