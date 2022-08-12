(global as any).IS_REACT_ACT_ENVIRONMENT = true;

import { describe, expect } from '@jest/globals';
import { outputFor, parserFor } from 'simple-markdown';
import { getParserRules, getRenderRules } from '../../md/rules';
import { hasNodes } from '../helpers/ast';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

const container = document.createElement('div');
const root = createRoot(container);

describe('footnotes', () => {
  const parse = parserFor(getParserRules());
  const render = outputFor(getRenderRules(), 'react');

  test('footnotes can be parsed', () => {
    const text = `# header\n\nPage content.[^1]\n\n[^1]: Footnote content.`;
    expect(hasNodes('mw-footnote', parse(text))).toBeTruthy();
  });

  test('footnotes are displayed', () => {
    const text = `# header\n\nPage content.[^1]\n\n[^1]: Footnote content.`;
    const output = render(parse(text));
    act(() => root.render(<>{output}</>));
    expect(
      container.textContent?.includes('1. Footnote content.')
    ).toBeTruthy();
  });
});
