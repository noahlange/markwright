import * as React from 'react';
import { blockRegex, defaultRules, inlineRegex } from 'simple-markdown';
import divOf from '../utils/divOf';

export default {
  ...defaultRules,
  blockQuote: {
    ...defaultRules.blockQuote,
    match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)+\n/)
  },
  heading: {
    ...defaultRules.heading,
    // adjusted so newlines aren't required after headings
    match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)
  },
  mw: {
    react(node, output) {
      return (
        <div className="mw" key={`mw-${node.id}`}>
          {output(node.content)}
        </div>
      );
    }
  },
  'mw-block': {
    match: blockRegex(/^:::(.+)\n((.|\n)+)\n:::/),
    order: 0,
    parse(capture, recurseParse, state) {
      if (!state.blocks) {
        state.blocks = 1;
      }
      return {
        block: capture[1],
        // hacky hack hack; we need to parse the contents for block-level items,
        // so we'll wrap it in newlines until the parser's happy
        content: recurseParse(
          `\n\n${capture[2]}\n\n`,
          { inline: false },
          state
        ),
        id: state.blocks++
      };
    },
    react(node, output) {
      return (
        <div key={node.id} className={`block block-${node.block}`}>
          {output(node.content)}
        </div>
      );
    }
  },
  'mw-body': divOf('mw-body'),
  'mw-break': {
    match: blockRegex(/^\{\.break\}/),
    order: 0,
    parse(capture, recurseParse, state) {
      if (!state.breaks) {
        state.breaks = 1;
      }
      return { id: state.breaks++ };
    },
    react(node) {
      return <div key={`mw-break-${node.id}`} className="mw-break" />;
    }
  },
  'mw-column': divOf('mw-column'),
  'mw-column-separator': {
    react(node, output) {
      return <div key={node.id} className="mw-column-separator" />;
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
      return node.inline ? (
        <sup key={`${node.key}-inline`}>{node.id}</sup>
      ) : (
        <div key={node.key} className="mw-footnote">
          {node.id}. {output(node.content)}
        </div>
      );
    }
  },
  'mw-footnotes': {
    react(node, output) {
      const str = `mw-footnotes ${
        node.content && node.content.length ? '' : 'mw-empty'
      }`;
      return (
        <div key={node.id} className={str}>
          {output(node.content)}
        </div>
      );
    }
  },
  'mw-header': divOf('mw-header'),
  'mw-page': {
    react(node, output) {
      const even = node.id % 2 ? 'mw-odd' : 'mw-even';
      return (
        <div key={`mw-page-${node.id}`} className={`mw-page ${even}`}>
          {output(node.content)}
          <div key={`mw-page-${node.id}-pagination`} className="mw-pagination">
            {node.id}
          </div>
        </div>
      );
    }
  },
  'mw-section': {
    react(node, output) {
      return (
        <div key={`mw-section-${node.id}`} className="mw-section">
          {output(node.content)}
        </div>
      );
    }
  },
  paragraph: {
    ...defaultRules.paragraph,
    react(node, output, state) {
      return <p key={state.key}>{output(node.content)}</p>;
    }
  }
};
