import fde from 'fast-deep-equal';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { parserFor, reactFor, ruleOutput } from 'simple-markdown';

import Region from './lib/Region';
import Section from './lib/Section';
import modifyAST from './markdown/ast';
import rules from './markdown/rules';

export type HighlightFn = (content: string, lang: string) => Promise<string>;

type MarkwrightProps = {
  context: object;
  manual?: boolean;
  virtualized?: boolean;
  regions: Region[];
  highlight?: HighlightFn;
  flowed: boolean;
  value: string;
  columns: number;
  container: {
    height: number;
    width: number;
  };
  page: {
    width: number;
    height: number;
  };
  onFlow(a: Section[]): void;
};

type MarkwrightState = {
  content: string;
  context: object;
  containerHeight: number;
  containerWidth: number;
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
        <div style={{ ...style, top: top + index * 32 }}>{render(page)}</div>
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

  public static render(
    content: string,
    context: object,
    page: { width: number; height: number },
    container: { width: number; height: number },
    regions?: Section[],
    columns?: number,
    highlight?: HighlightFn
  ) {
    const r = rules({ highlight, context });
    const parser = parserFor(r);
    const tree = parser(content);
    const sections = modifyAST(tree, regions, columns);
    const pages = sections.reduce((a, b) => a + b.content.length, 0) || 1;
    return (
      <div className="sections" style={{ width: page.width }}>
        <List
          width={container.width}
          height={container.height}
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
    const next: Partial<MarkwrightState> = {};

    if (!fde(props.context, state.context)) {
      next.context = props.context;
    }
    if (
      props.container.width !== state.containerWidth ||
      props.container.height !== state.containerHeight
    ) {
      next.containerHeight = props.container.height;
      next.containerWidth = props.container.width;
    }

    if (props.value !== state.content) {
      next.content = props.value;
      next.flowed = false;
      next.regions = [];
    } else if (props.flowed) {
      next.flowed = true;
      next.regions = props.regions;
    }

    return Object.keys(next).length ? { ...state, ...next } : null;
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
    containerHeight: this.props.container.height,
    containerWidth: this.props.container.width,
    content: this.props.value,
    context: this.props.context,
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
    return (
      <div
        className={this.state.flowed ? '' : 'unflowed'}
        ref={e => (Markwright.ref = e)}
      >
        {/* insert additional styles that should not be overridden */}
        <style type="text/css">{this.state.style}</style>
        {Markwright.render(
          this.state.content || ' ',
          this.state.context,
          this.props.page,
          {
            height: this.state.containerHeight,
            width: this.state.containerWidth
          },
          this.state.regions,
          this.props.columns,
          this.props.highlight
        )}
      </div>
    );
  }
}
