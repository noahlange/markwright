import * as React from 'react';
import { parserFor, reactFor, ruleOutput } from 'simple-markdown';

import ast from './markdown/ast';
import rules from './markdown/rules';

import Region from './lib/Region';
import Section from './lib/Section';

interface ISection {
  title: string;
  content: string;
}

interface IMarkwrightProps {
  regions: Section[];
  flowed: boolean;
  content: string;
  onFlow(a: Section[]): void;
}

export default class Markwright extends React.Component<IMarkwrightProps, any> {
  public static react(content: string, regions?: any[]) {
    const parser = parserFor(rules);
    const tree = parser(content);
    const render = reactFor(ruleOutput(rules, 'react'));
    return render(ast(tree, regions));
  }

  public static heightOf(e: HTMLElement, i: number) {
    const off = e.offsetHeight;
    const s = getComputedStyle(e);
    const l = parseInt(s.marginLeft, 10);
    const r = parseInt(s.marginRight, 10);
    const t = parseInt(s.marginTop, 10);
    const b = parseInt(s.marginBottom, 10);
    return off + l + t + b + r;
  }

  public static getDerivedStateFromProps(
    nextProps: IMarkwrightProps,
    prevState
  ) {
    if (nextProps.content !== prevState.content) {
      return {
        content: nextProps.content,
        flowed: false,
        regions: []
      };
    } else if (nextProps.flowed) {
      return { flowed: true, regions: nextProps.regions };
    }
    return null;
  }

  public static flow(): Section[] {
    const sections: Section[] = [];
    for (const page of document.querySelectorAll('.mw-section')) {
      const section = new Section();
      // should only be one page / column for an unflowed section
      const column = page.querySelector('.mw-column');
      const regions: Region[] = [];
      const height = column.clientHeight;
      // sliced are all the HTML elements in the column
      let sliced: HTMLElement[] = [].slice.call(column.children);

      while (sliced.length) {
        const heights = sliced.map(Markwright.heightOf);
        let [total, current] = [0, 0];

        while (total < height) {
          const node = sliced[current];
          if (node) {
            if (node.classList.contains('mw-break')) {
              current++;
              break;
            }
          }
          if (total + heights[current] > height) {
            current++;
            break;
          } else {
            total += heights[current];
            current++;
          }
        }
        const region = new Region();
        region.elements = sliced.slice(0, current);
        if (region.size === 0) {
          break;
        }
        section.regions.push(region);
        sliced = sliced.slice(current);
      }
      sections.push(section);
    }
    return sections;
  }

  public state = {
    content: this.props.content,
    flowed: false,
    regions: []
  };

  public reflow() {
    if (!this.state.flowed) {
      const r = Markwright.flow();
      this.props.onFlow(r);
    }
  }

  public componentDidUpdate() {
    this.reflow();
  }

  public componentDidMount() {
    this.reflow();
  }

  public render() {
    return Markwright.react(this.state.content, this.state.regions);
  }
}
