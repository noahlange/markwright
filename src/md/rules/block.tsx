import type { ParserRule, ReactOutputRule } from 'simple-markdown';

import { blockRegex } from 'simple-markdown';

import { nanoid } from '../../utils';

const mwBlock: ParserRule & ReactOutputRule = {
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
      content: recurseParse(`\n\n${capture[3]}\n\n`, state),
      id: nanoid()
    };
  },
  react(node, output) {
    return (
      <div id={node.id} key={node.id} className={`block ${node.block}`}>
        {output(node.content)}
      </div>
    );
  }
};

export default mwBlock;
