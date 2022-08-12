import type { RenderFn } from '../md/rules/page';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { outputFor, parserFor } from 'simple-markdown';

import { getFlowedAST, getSectionedAST } from '../md/ast';
import * as rules from '../md/rules';
import { PrerenderWrapper } from '.';

interface MarkwrightProps {
  className?: string;
  value: string;
  highlight?: (code: string, lang: string) => string;
  header?: RenderFn;
  footer?: RenderFn;
}

const parse = parserFor(rules.getParserRules());
const prerender = outputFor(rules.getPrerenderRules(), 'react');

export function Markwright(props: MarkwrightProps): JSX.Element {
  // unfortunately, we need to render the document in two passes
  // the first pass is throwing everything onto a single page.
  const [unflowed, setUnflowed] = useState<JSX.Element | null>(null);
  // the second one uses the DOM output of the first pass to paginate
  const [flowed, setFlowed] = useState<JSX.Element | null>(null);

  // header/footer can be custom render functions
  const render = useMemo(
    () => outputFor(rules.getRenderRules(props), 'react'),
    [props.header, props.footer]
  );

  // we _absolutely_ do not want to re-parse every time there's an update
  const ast = useMemo(() => parse(props.value), [props.value]);

  useEffect(() => setUnflowed(prerender(getSectionedAST(ast))), [ast]);

  const ref = useCallback(
    (node: HTMLDivElement) => {
      if (node && unflowed) {
        const fAST = getFlowedAST(ast, node);
        setFlowed(render(fAST));
      }
    },
    [unflowed, props.className]
  );

  return (
    <div className={props.className}>
      <PrerenderWrapper ref={ref}>{unflowed}</PrerenderWrapper>
      <div className={`mw`}>{flowed}</div>
    </div>
  );
}
