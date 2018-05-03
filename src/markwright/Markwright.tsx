import * as React from 'react';
import { parserFor, reactFor, ruleOutput } from 'simple-markdown';

import Region from './lib/Region';
import Section from './lib/Section';
import ast from './markdown/ast';
import rules from './markdown/rules';

interface IMarkwrightProps {
  regions: Section[];
  flowed: boolean;
  value: string;
  columns: number;
  onFlow(a: Section[]): void;
}

export default class Markwright extends React.Component<IMarkwrightProps, any> {
  public static react(content: string, regions?: any[], columns?: number) {
    const parser = parserFor(rules);
    const tree = parser(content);
    const render = reactFor(ruleOutput(rules, 'react'));
    return render(ast(tree, regions, columns));
  }

  public static getDerivedStateFromProps(props: IMarkwrightProps, state) {
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

  public static flow(): Section[] {
    const sections: Section[] = [];
    // approximate additional height of the footnote block, sans footnotes.
    const FOOTNOTE_BLOCK_HEIGHT = 48;
    for (const page of document.querySelectorAll('.mw-section')) {
      const section = new Section();
      // should only be one page / column for an unflowed section
      const column = page.querySelector('.mw-column');
      const height =
        column.getBoundingClientRect().height - FOOTNOTE_BLOCK_HEIGHT;
      const regions: Region[] = [];
      // sliced are all the HTML elements in our unflowed mega-column
      const sliced: HTMLElement[] = [].slice.call(column.children);
      let region = new Region();
      for (const node of sliced) {
        if (node.classList.contains('mw-break')) {
          section.add(region);
          region = new Region();
        } else {
          region.add(node);
          if (region.height > height) {
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
    return sections;
  }

  public state = {
    content: this.props.value,
    flowed: false,
    regions: [],
    style: `
      .mw-unflowed .mw-footnote { display: block; }
    `
  };

  public reflow() {
    if (!this.state.flowed) {
      this.props.onFlow(Markwright.flow());
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
      <div className={this.state.flowed ? '' : 'mw-unflowed'}>
        {/* insert additional styles that should not be overridden */}
        <style type="text/css">{this.state.style}</style>
        {Markwright.react(
          // @todo - hack to stop the page from disappearing.
          this.state.content || ' ',
          this.state.regions,
          this.props.columns
        )}
      </div>
    );
  }
}
