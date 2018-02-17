import * as React from 'react';
import Page from './Page';

interface IPagesProps {
  pages: number;
  title: string;
  flow: any;
  footnotes: Array<[ number, string ]>;
  start: number;
}

export default function Pages({
  pages,
  title,
  flow,
  footnotes,
  start
}: IPagesProps) {
  const children = [];
  for (let i = 0; i < pages; i++) {
    children.push(
      <Page
        num={i + start + 1}
        key={i + start}
        footnotes={footnotes}
        flow={flow}
        title={title}
      />
    );
  }
  return <>{children}</>;
}
