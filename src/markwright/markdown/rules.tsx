import * as React from 'react';
import Async from 'react-promise';
import { blockRegex, defaultRules, inlineRegex } from 'simple-markdown';

import blockOf from '../utils/blockOf';

export default ({ highlight }) => {
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
        return (
          <div key={state.key}>
            <Async
              promise={content}
              pending={() => (
                <pre>
                  <code>{node.content}</code>
                </pre>
              )}
              then={(v: string) => {
                return (
                  <pre className={`lang lang-${node.lang}`}>
                    <code dangerouslySetInnerHTML={{ __html: v }} />
                  </pre>
                );
              }}
            />
          </div>
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
        return (
          <div className="mw" key={`mw-${node.id}`}>
            {output(node.content)}
          </div>
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
        return (
          <div key={node.id} className={`block ${node.block}`}>
            {output(node.content)}
          </div>
        );
      }
    },
    'mw-body': blockOf('mw-body'),
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
        return <div key={`mw-break-${node.id}`} className="break" />;
      }
    },
    'mw-column': blockOf('mw-column'),
    'mw-column-separator': {
      react(node) {
        return <div key={node.id} className="column-separator" />;
      }
    },
    'mw-content': blockOf('mw-content'),
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
          <sup key={`${node.id}-inline`}>{node.id}</sup>
        ) : (
          <span key={node.id} className="footnote">
            {node.id}. {output(node.content)}
          </span>
        );
      }
    },
    'mw-footnotes': {
      react(node, output) {
        const str = `footnotes ${
          node.content && node.content.length ? '' : 'empty'
        }`;
        return (
          <div key={`mw-footnote-${node.id}`} className={str}>
            {output(node.content)}
          </div>
        );
      }
    },
    'mw-header': blockOf('mw-header'),
    'mw-page': {
      react(node, output) {
        const even = node.id % 2 ? 'odd' : 'even';
        return (
          <div
            key={`mw-page-${node.id}`}
            className={`page page-${node.id} ${even}`}
          >
            <>
              {output(node.content)}
              <div key={`mw-page-${node.id}-pagination`} className="pagination">
                {node.id}
              </div>
            </>
          </div>
        );
      }
    },
    'mw-section': {
      react(node, output) {
        return (
          <div key={`mw-section-${node.id}`} className="section">
            {output(node.content)}
          </div>
        );
      }
    },
    paragraph: {
      ...defaultRules.paragraph,
      react(node, output, state) {
        return <p key={`p-${state.key}`}>{output(node.content)}</p>;
      }
    }
  };
};
