import * as React from 'react';
import { blockRegex, defaultRules, inlineRegex } from 'simple-markdown';
import divOf from '../utils/divOf';

export default {
  ...defaultRules,
  heading: {
    ...defaultRules.heading,
    // adjusted so newlines aren't required after headings
    match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)
  },
  mw: {
    react(node, output) {
      return <div className="mw">{output(node.content)}</div>;
    }
  },
  'mw-block': {
    match: blockRegex(/^:::(.+)\n(.+)\n:::/),
    order: 0,
    parse(capture, recurseParse, state) {
      return {
        block: capture[1],
        content: recurseParse(capture[2])
      };
    },
    react(node, output) {
      return (
        <div className={`block block-${node.block}`}>
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
      return {
        content: null
      };
    },
    react() {
      return <div className="mw-break" />;
    }
  },
  'mw-column': divOf('mw-column'),
  'mw-column-separator': {
    react(node, output) {
      return <div className="mw-column-separator" />;
    }
  },
  'mw-content': divOf('mw-content'),
  'mw-footnote': {
    match: inlineRegex(/^\^\[(.+?)\]/),
    order: defaultRules.link.order - 1,
    parse(capture, recurseParse, state) {
      return {
        content: recurseParse(capture[1], state)
      };
    },
    react(node, output) {
      return node.inline ? (
        <sup>{node.id}</sup>
      ) : (
        <div id={`footnote-${node.id}`} className="mw-footnote">
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
          <div className="mw-pagination">{node.id}</div>
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
    react(node, output) {
      return <p>{output(node.content)}</p>;
    }
  }
};
