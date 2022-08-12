import type { ParserRule, ReactOutputRule } from 'simple-markdown';

import { blockRegex } from 'simple-markdown';

import { nanoid } from '../../utils';

const mwBreak: ParserRule & ReactOutputRule = {
  match: blockRegex(/^<br(?:-(page|col))?\s?\/?>/),
  order: 0,
  parse(capture) {
    return { breakType: capture[1] || 'line', id: nanoid() };
  },
  react(node) {
    switch (node.breakType) {
      case 'col':
      case 'page': {
        return (
          <div
            id={node.id}
            key={node.id}
            className={`mw-break-${node.breakType}`}
          />
        );
      }
      default: {
        return <br id={node.id} key={node.id} />;
      }
    }
  }
};

export default mwBreak;
