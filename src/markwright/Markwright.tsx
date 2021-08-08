import * as React from 'react';
import { List } from 'react-virtualized';
// @ts-ignore
import { ruleOutput, parserFor, reactFor } from 'simple-markdown';

import Region from './lib/Region';
import Section from './lib/Section';
import modifyAST from './markdown/ast';
import rules from './markdown/rules';

type HighlightFn = (content: string, lang: string) => Promise<string>;

type MarkwrightProps = {
  manual?: boolean;
  regions: Section[];
  highlight: HighlightFn;
  flowed: boolean;
  value: string;
  columns: number;
  page?: {
    width: number;
    height: number;
  };
  onFlow(a: Section[]): void;
};

function pageRenderer(paper, sections, r) {
  const output = ruleOutput(r, 'react');
  const render = reactFor(output);
  return ({ key, index, style }) => {
    let count = 0;
    const section = sections.find(s => (count += s.content.length) > index);
    const page = section.content[index - count + section.content.length];
    return (
      <div
        key={key}
        style={{
          ...style,
          left: (window.innerWidth - paper.width) / 2,
          marginBottom: 32,
          top: style.top + 64
        }}
      >
        {render(page)}
      </div>
    );
  };
}

export default class Markwright extends React.Component<MarkwrightProps, any> {
  public static ref: HTMLDivElement;
  public static rules: any;

  public static react(
    content: string,
    regions?: any[],
    columns?: number,
    highlight?: HighlightFn,
    page?: { width: number; height: number }
  ) {
    const r = this.rules ? this.rules : (this.rules = rules({ highlight }));
    const parser = parserFor(r);
    const tree = parser(content);
    const sections = modifyAST(tree, regions, columns);
    const pages = sections.reduce((a, b) => a + b.content.length, 0) || 1;
    const width = this.ref ? this.ref.clientWidth : window.innerWidth;
    const height = this.ref ? this.ref.clientHeight : window.innerHeight;
    return (
      <div className="section">
        <List
          width={width}
          height={height}
          rowHeight={page.height + 64}
          rowCount={pages}
          rowRenderer={pageRenderer(page, sections, r)}
        />
      </div>
    );
  }

  public static getDerivedStateFromProps(props: MarkwrightProps, state) {
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
    for (const page of this.ref.querySelectorAll('.page')) {
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
    return (
      <div
        className={this.state.flowed ? '' : 'unflowed'}
        ref={e => (Markwright.ref = e)}
      >
        {/* insert additional styles that should not be overridden */}
        <style type="text/css">{this.state.style}</style>
        {Markwright.react(
          // @todo - hack to stop the page from disappearing.
          this.state.content || ' ',
          this.state.regions,
          this.props.columns,
          this.props.highlight,
          this.props.page
        )}
      </div>
    );
  }
}
