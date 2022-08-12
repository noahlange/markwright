import type { MarkwrightOptions } from '../../types';
import type {
  DefaultArrayRule,
  OutputRules,
  ParserRule,
  ParserRules,
  ReactOutputRule
} from 'simple-markdown';

import { defaultRules } from 'simple-markdown';

import { blockRender, idParse, idRender } from '../utils';

import mwBlock from './block';
import mwBreak from './break';
import { paragraph, blockQuote, heading } from './misc';
import { mw, mwPage, mwHeader, mwFooter } from './page';
import { mwFootnote, mwFootnotes } from './footnotes';
import mwSection from './section';

const outputRules = {
  ...defaultRules,
  mw,
  paragraph,
  'mw-block': mwBlock,
  'mw-break': mwBreak,
  'mw-footnote': mwFootnote,
  'mw-footnotes': mwFootnotes,
  'mw-page': mwPage,
  'mw-section': mwSection,
  'mw-column-separator': blockRender('hr', 'mw-column-separator'),
  'mw-body': blockRender('div', 'mw-body'),
  'mw-column': blockRender('div', 'mw-column'),
  'mw-content': blockRender('div', 'mw-content'),
  'mw-header': blockRender('div', 'mw-header')
};

export function getPrerenderRules(): OutputRules<ReactOutputRule> {
  const res: Record<string, ReactOutputRule> = {};
  for (const key in outputRules) {
    const rule = { ...(outputRules as unknown as any)[key] };
    if (!key.startsWith('mw')) {
      const defaultRender = rule.react;
      if (defaultRender) {
        rule.react = idRender(defaultRender);
      }
    }
    res[key] = rule;
  }
  return res;
}

export function getRenderRules(
  options: MarkwrightOptions = {}
): OutputRules<ReactOutputRule> {
  const header = options.header ?? (section => <>{section.name}</>);
  const footer = options.footer ?? ((_, page) => <>{page.number}</>);

  return {
    ...outputRules,
    'mw-header': mwHeader(header),
    'mw-footer': mwFooter(footer)
  };
}

export function getParserRules(): ParserRules {
  const parserRules = {
    ...defaultRules,
    blockQuote,
    heading,
    paragraph,
    'mw-block': mwBlock,
    'mw-break': mwBreak,
    'mw-footnote': mwFootnote
  };

  const res: Record<string, ParserRule | DefaultArrayRule> = {};
  for (const key in parserRules) {
    const rule = { ...(parserRules as unknown as any)[key] };
    const defaultParse = rule.parse;
    rule.parse = idParse(defaultParse);
    res[key] = rule;
  }
  return res;
}
