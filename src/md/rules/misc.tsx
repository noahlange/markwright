import type { ParserRule, ReactOutputRule } from 'simple-markdown';

import { blockRegex, defaultRules } from 'simple-markdown';

import { blockRender } from '../utils';

export const heading: ParserRule & ReactOutputRule = {
  ...defaultRules.heading,
  // adjusted so empty lines aren't required after headings
  match: blockRegex(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/)
};

export const blockQuote: ParserRule & ReactOutputRule = {
  ...defaultRules.blockQuote,
  match: blockRegex(/^( *>[^\n]+(\n[^\n]+)*\n*)/),
  ...blockRender('blockquote')
};

export const paragraph: ParserRule & ReactOutputRule = {
  ...defaultRules.paragraph,
  ...blockRender('p')
};
