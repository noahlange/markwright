import type { ParserRule, ReactOutputRule } from 'simple-markdown';

import { defaultRules, inlineRegex } from 'simple-markdown';

import { nanoid } from '../../utils';

export const mwFootnote: ParserRule & ReactOutputRule = {
  match: inlineRegex(/^\[\^([\d\w]+)\](?::(\s.+))?/),
  order: defaultRules.link.order - 1,
  parse(capture, recurseParse, state) {
    const [, anchor, content] = capture;
    return {
      id: nanoid(),
      anchor,
      inline: !content,
      content: recurseParse(content ?? null, state)
    };
  },
  react(node, output) {
    const target = `footnote-${node.anchor}`;
    const content = node.content ? output(node.content) : null;
    const num = node.number ?? node.anchor;
    return node.inline ? (
      <sup key={node.id}>
        <a href={target}>{num}</a>
      </sup>
    ) : (
      <span key={node.id} id={target} className="footnote">
        {num}.{content}
      </span>
    );
  }
};

export const mwFootnotes: ReactOutputRule = {
  react(node, output) {
    const str = `footnotes ${node.content?.length ? '' : 'empty'}`;
    return (
      <div key={`mw-footnote-${node.id}`} className={str}>
        {output(node.content)}
      </div>
    );
  }
};
