import * as MarkdownIt from 'markdown-it';
import * as Attrs from 'markdown-it-attrs';

import * as React from 'react';
import { generate } from 'shortid';

import DivFence from '../markdown/container';
import Footnote from '../markdown/footnote';

import Content from './Content';
import Page from './Page';
import Pages from './Pages';

const FOOTNOTE_REGEX =
  /\s*<div class="footnote footnote-(\d)">([\s\S]*?)<\/div>/gi;

const Stylesheet = ({ id }) => {
  const into = `.mw-content-${id} { flow-into: ${id}; }`;
  const from = `.mw-section-${id} .mw-column { flow-from: ${id}; }`;
  return <style type="text/css">{into + from}</style>;
};

interface ISectionProps {
  /** section index */
  idx: number;
  /** pagination start */
  start: number;
  /** add page handler */
  addPage: (idx: number, pages: number) => void;
  /** section content */
  content: string;
  /** section title */
  title: string;
}

interface ISectionState {
  md: MarkdownIt.MarkdownIt;
  pages: number;
}

/**
 * Represents a H1-delimeted segment of the main document.
 */
export default class Section extends React.Component<
  ISectionProps,
  ISectionState
> {
  public mounted = false;
  public flow = null;
  public id: string = generate().toLowerCase();
  public html: string;

  public state = {
    md: new MarkdownIt({ html: true, typographer: true, breaks: true })
      .use(Attrs)
      .use(Footnote)
      .use(DivFence),
    pages: 1
  };

  public overset = event => {
    // overset
    if (event.target.overset) {
      this.setState({ pages: this.state.pages + 1 });
      this.props.addPage(this.props.idx, this.state.pages);
    } else {
      const overflow = event.target.firstEmptyRegionIndex;
      // underset
      if (overflow % 2 === 0) {
        // only force a relayout when we have overflow onto an empty page.
        this.setState(
          {
            pages: Math.ceil(overflow / 2)
          },
          () => this.flow.relayout()
        );
      }
    }
  };

  public observe = (element: HTMLDivElement) => {
    const mutation = new MutationObserver(m => {
      const flow = (document as any).getNamedFlows()[this.id];
      if (flow && this.mounted) {
        this.flow = flow;
        flow.addEventListener('regionoversetchange', this.overset);
        mutation.disconnect();
        this.forceUpdate();
      }
    });
    if (element) {
      mutation.observe(element, { attributes: true });
    }
  };

  public stripEscapes(raw: string) {
    let html = raw;
    const footnotes = {};
    let match = FOOTNOTE_REGEX.exec(raw);
    while (match !== null) {
      footnotes[match[1]] = match[2];
      match = FOOTNOTE_REGEX.exec(raw);
    }
    html = html.replace(
      FOOTNOTE_REGEX,
      (m, i) => `<sup class="footnote-${this.id} footnote-${i}">${i}</sup>`
    );
    return { html, footnotes };
  }

  public generateFootnotes(fns) {
    const footnotes = [];
    if (this.flow) {
      const regions = this.flow.regions;
      for (const num of Object.keys(fns)) {
        const owner = regions.findIndex(r =>
          r.querySelector(`.footnote-${this.id}.footnote-${num}`)
        );
        const addition = [num, fns[num]];
        footnotes[owner] = footnotes[owner]
          ? footnotes[owner].concat([addition])
          : [addition];
      }
    } else {
      return Object.keys(fns).map(num => [num, fns[num]]);
    }
    return footnotes;
  }

  public componentDidMount() {
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
  }

  public render() {
    const raw = this.state.md.render(this.props.content);
    const { html, footnotes } = this.stripEscapes(raw);
    const fns = this.generateFootnotes(footnotes);
    return (
      <div className={`mw-section mw-section-${this.id}`}>
        <Stylesheet id={this.id} />
        <Pages
          title={this.props.title}
          start={this.props.start}
          pages={this.state.pages}
          footnotes={fns}
          flow={this.flow}
        />
        <Content
          id={this.id}
          flow={this.flow}
          observe={this.observe}
          content={html}
        />
      </div>
    );
  }
}
