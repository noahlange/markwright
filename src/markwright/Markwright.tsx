import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { parserFor, reactFor, ruleOutput } from 'simple-markdown';

import Region from './lib/Region';
import Section from './lib/Section';
import modifyAST from './markdown/ast';
import rules from './markdown/rules';

export type HighlightFn = (content: string, lang: string) => Promise<string>;

type MarkwrightProps = {
  manual?: boolean;
  virtualized?: boolean;
  regions: Section[];
  highlight?: HighlightFn;
  flowed: boolean;
  value: string;
  columns: number;
  page: {
    width: number;
    height: number;
  };
  onFlow(a: Section[]): void;
};

type MarkwrightState = {
  content: string;
  flowed: boolean;
  regions: Region[];
  style: string;
};

function pageRenderer(sections: ISectionNode[], r: $AnyFixMe) {
  const output = ruleOutput(r, 'react');
  const render = reactFor(output);
  return ({ index, style }: { index: number; style: React.CSSProperties }) => {
    let count = 0;
    const section = sections.find(s => (count += s.content.length) > index);
    if (section) {
      const page = section.content[index - count + section.content.length];
      const top = style.top ? +style.top : 0;
      return (
        <div style={{ ...style, top: top + (index + 1) * 32 }}>
          {render(page)}
        </div>
      );
    }
    return <div />;
  };
}

export default class Markwright extends React.Component<
  MarkwrightProps,
  MarkwrightState
> {
  public static ref: HTMLDivElement | null;
  public static rules: $AnyFixMe;

  public static react(
    content: string,
    page?: { width: number; height: number },
    regions?: $AnyFixMe[],
    columns?: number,
    highlight?: HighlightFn
  ) {
    const r = Markwright.rules || (Markwright.rules = rules({ highlight }));
    const parser = parserFor(r);
    const tree = parser(content);
    const sections = modifyAST(tree, regions, columns);
    const output = ruleOutput(r, 'react');
    const render = reactFor(output);
    return (
      <div className="section" style={{ width: page ? page.width : undefined }}>
        {render(sections)}
      </div>
    );
  }

  public static reactVirtualized(
    content: string,
    page: { width: number; height: number },
    regions?: Section[],
    columns?: number,
    highlight?: HighlightFn
  ) {
    const r = Markwright.rules || (Markwright.rules = rules({ highlight }));
    const parser = parserFor(r);
    const tree = parser(content);
    const sections = modifyAST(tree, regions, columns);
    const pages = sections.reduce((a, b) => a + b.content.length, 0) || 1;
    const height = Markwright.ref
      ? Markwright.ref.clientHeight
      : window.innerHeight;
    return (
      <div className="section" style={{ width: page.width }}>
        <List
          width={page.width}
          height={height}
          itemSize={page.height}
          itemCount={pages}
        >
          {pageRenderer(sections, r)}
        </List>
      </div>
    );
  }

  public static getDerivedStateFromProps(
    props: MarkwrightProps,
    state: MarkwrightState
  ) {
    if (props.value !== state.content) {
      return {
        content: props.value,
        flowed: false,
        regions: []
      };
    } else if (props.flowed) {
      return { flowed: true, regions: props.regions };
    }
    return null;
  }

  public static flow(manual?: boolean): Section[] {
    const sections: Section[] = [];
    // approximate additional height of the footnote block, sans footnotes.
    const FOOTNOTE_BLOCK_HEIGHT = 48;
    const pages = this.ref ? this.ref.querySelectorAll('.page') : [];
    for (const page of pages) {
      const section = new Section();
      // should only be one page / column for an unflowed section
      const column = page.querySelector('.column') as HTMLElement;
      if (column) {
        const height =
          column.getBoundingClientRect().height - FOOTNOTE_BLOCK_HEIGHT;
        // sliced are all the HTML elements in our unflowed mega-column
        const sliced: HTMLElement[] = [].slice.call(column.children);
        let region = new Region();
        for (const node of sliced) {
          if (node.classList.contains('break')) {
            section.add(region);
            region = new Region();
            region.add(node);
          } else {
            region.add(node);
            if (!manual && region.height > height) {
              region.elements.pop();
              section.add(region);
              region = new Region();
              region.add(node);
            }
          }
        }
        section.add(region);
        sections.push(section);
      }
    }
    return sections;
  }

  public state = {
    content: this.props.value,
    flowed: false,
    regions: [],
    style: `
      .unflowed .footnote { display: block; }
    `
  };

  public reflow() {
    if (!this.state.flowed) {
      this.props.onFlow(Markwright.flow(this.props.manual));
    }
  }

  public componentDidUpdate() {
    this.reflow();
  }

  public componentDidMount() {
    this.reflow();
  }

  public render() {
    const render = this.props.virtualized
      ? Markwright.reactVirtualized
      : Markwright.react;

    return (
      <div
        className={this.state.flowed ? '' : 'unflowed'}
        ref={e => (Markwright.ref = e)}
      >
        {/* insert additional styles that should not be overridden */}
        <style type="text/css">{this.state.style}</style>
        {(render as $AnyFixMe).call(
          Markwright,
          this.state.content || ' ',
          this.props.page,
          this.state.regions,
          this.props.columns,
          this.props.highlight
        )}
      </div>
    );
  }
}
