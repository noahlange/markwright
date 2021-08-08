import React from 'react';
import fde from 'fast-deep-equal';
import { FixedSizeList } from 'react-window';
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
    content: [nodes],
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
            content: footnotes.map(f => ({ ...f, inline: false })),
            id: `mw-page-${page}-footnotes`,
            type: 'mw-footnotes'
          }
        ],
        id: `mw-page-${page}-body`,
        type: 'mw-body'
      }
    ],
    id: `${page}`,
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
  return;
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
function transformAST(ast, flow = [], columns = 2) {
  // first we have to split the parsed content into regions by h1
  let sections = [];
  for (const node of ast) {
    let last = sections[sections.length - 1];
    if (node.type === 'heading' && node.level === 1) {
      if ((last && last.title) || !last) {
        // close current section
        sections.push({
          content: [],
          id: `${sections.length + 1}`,
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
        id: '1',
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
          [
            {
              content: s.content,
              id: `mw-page-${page}-column-1`,
              type: 'mw-column'
            }
          ],
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
      const flowSection = flow[section] || { regions: [] };
      let correspondingNodeIndex = 0;
      // we're attempting to pair AST nodes to DOM elements
      for (const region of flowSection.regions) {
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
            footnotes.push({ ...node });
            node.inline = true;
          }
        });
        const sep = i => ({
          content: [],
          id: `mw-page-${p}-column-separator-${i}`,
          type: 'mw-column-separator'
        });
        const cols = nodes
          .filter(n => !!n)
          .map((n, i) => makeCol(`mw-page-${p}-column-${i + 1}`, n))
          .reduce((a, b, i) => (i === 0 ? [b] : [...a, sep(i), b]), []);
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

/**
 * A naïve implementation of a _.get style utility function.
 * @param obj object with property to be returned
 * @param path dot-delimited path into the object
 */
function get(obj, path) {
  const p = path.split('.');
  let o = obj;
  do {
    const c = p.shift();
    if (c && c in o) {
      o = o[c];
    }
  } while (p.length);
  return Object.is(obj, o) ? null : o;
}

var rules = ({ highlight, context }) => {
  return {
    ...defaultRules,
    blockQuote: {
      ...defaultRules.blockQuote,
      match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n/)
    },
    codeBlock: {
      ...defaultRules.codeBlock,
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
    },
    heading: {
      ...defaultRules.heading,
      // adjusted so empty lines aren't required after headings
      match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)
    },
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
    paragraph: {
      ...defaultRules.paragraph,
      react(node, output, state) {
        return React.createElement(
          'p',
          { key: `p-${state.key}` },
          output(node.content)
        );
      }
    },
    variable: {
      match: inlineRegex(/^{{\s*((?:\w|\.)+)\s*}}/),
      order: defaultRules.em.order,
      parse(capture) {
        const name = capture[1];
        return { content: name, type: 'variable' };
      },
      react(node, _output, state) {
        return React.createElement(
          'span',
          { key: state.key },
          get(context, node.content)
        );
      }
    }
  };
};

function pageRenderer(sections, r) {
  const output = ruleOutput(r, 'react');
  const render = reactFor(output);
  return ({ index, style }) => {
    let count = 0;
    const section = sections.find(s => (count += s.content.length) > index);
    if (section) {
      const page = section.content[index - count + section.content.length];
      const top = style.top ? +style.top : 0;
      return React.createElement(
        'div',
        { style: { ...style, top: top + index * 32 } },
        render(page)
      );
    }
    return React.createElement('div', null);
  };
}
class Markwright extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      containerHeight: this.props.container.height,
      containerWidth: this.props.container.width,
      content: this.props.value,
      context: this.props.context,
      flowed: false,
      regions: [],
      style: `
      .unflowed .footnote { display: block; }
    `
    };
  }
  static render(
    content,
    context,
    page,
    container,
    regions,
    columns,
    highlight
  ) {
    const r = rules({ highlight, context });
    const parser = parserFor(r);
    const tree = parser(content);
    const sections = transformAST(tree, regions, columns);
    const pages = sections.reduce((a, b) => a + b.content.length, 0) || 1;
    return React.createElement(
      'div',
      { className: 'sections', style: { width: page.width } },
      React.createElement(
        FixedSizeList,
        {
          width: container.width,
          height: container.height,
          itemSize: page.height,
          itemCount: pages
        },
        pageRenderer(sections, r)
      )
    );
  }
  static getDerivedStateFromProps(props, state) {
    const next = {};
    if (!fde(props.context, state.context)) {
      next.context = props.context;
    }
    if (
      props.container.width !== state.containerWidth ||
      props.container.height !== state.containerHeight
    ) {
      next.containerHeight = props.container.height;
      next.containerWidth = props.container.width;
    }
    if (props.value !== state.content) {
      next.content = props.value;
      next.flowed = false;
      next.regions = [];
    } else if (props.flowed) {
      next.flowed = true;
      next.regions = props.regions;
    }
    return Object.keys(next).length ? { ...state, ...next } : null;
  }
  static flow(manual) {
    const sections = [];
    // approximate additional height of the footnote block, sans footnotes.
    const FOOTNOTE_BLOCK_HEIGHT = 48;
    const pages = this.ref ? this.ref.querySelectorAll('.page') : [];
    for (const page of pages) {
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
      Markwright.render(
        this.state.content || ' ',
        this.state.context,
        this.props.page,
        {
          height: this.state.containerHeight,
          width: this.state.containerWidth
        },
        this.state.regions,
        this.props.columns,
        this.props.highlight
      )
    );
  }
}

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
    const container = {
      ...{
        height: window.innerHeight,
        width: 96 * 8.5
      },
      ...(this.props.container || {})
    };
    return React.createElement(Markwright, {
      value: this.props.value,
      context: this.props.context || {},
      container: container,
      page: this.config('page', { width: 96 * 8.5, height: 96 * 11 }),
      manual: this.config('manual', true),
      columns: this.config('manual', true) ? 1 : this.config('columns', 2) || 1,
      highlight: this.config('highlight'),
      flowed: this.state.flowed,
      regions: this.state.regions,
      virtualized: true,
      onFlow: r => this.setState({ flowed: true, regions: r })
    });
  }
}

export default index;
