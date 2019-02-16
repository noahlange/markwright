import React from 'react';
import { parserFor, reactFor, ruleOutput } from 'simple-markdown';

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

export default class Markwright extends React.Component<
  MarkwrightProps,
  $AnyFixMe
> {
  public static ref: HTMLDivElement | null = null;
  public static rules: $AnyFixMe;

  public static react(
    content: string,
    regions?: $AnyFixMe[],
    columns?: number,
    highlight?: HighlightFn
  ) {
    const r = this.rules ? this.rules : (this.rules = rules({ highlight }));
    const parser = parserFor(r);
    const tree = parser(content);
    const output = ruleOutput(r, 'react');
    const render = reactFor(output);
    const sections = modifyAST(tree, regions, columns);
    return render(sections);
  }

  public static getDerivedStateFromProps(
    props: MarkwrightProps,
    state: $AnyFixMe
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
    if (this.ref) {
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
          this.props.highlight
        )}
      </div>
    );
  }
}
