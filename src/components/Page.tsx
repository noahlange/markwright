import * as React from 'react';

const Column = () => <div className="mw-column" />;
const Pagination = ({ num }) => <div className="mw-pagination">{num}</div>;
const Header = ({ title }) => <div className="mw-header">{ title }</div>;

const Footnote = ({ id, content }) => (
  <div className="mw-footnote">
    <sup>{id}</sup> {content}
  </div>
);

const Footnotes = ({ footnotes }) => {
  const notes = footnotes.map(([id, content], idx) => (
    <Footnote key={idx} id={id} content={content} />
  ));
  return <div className="mw-footnotes">{notes}</div>;
};

const Body = ({ footnotes }) => {
  return (
    <div className="mw-body">
      <div className="mw-floats" />
      <div className="mw-contents">
        <Column />
        <div className="mw-column-separator" />
        <Column />
      </div>
      <Footnotes footnotes={footnotes} />
    </div>
  );
};

const MarginNotes = () => (
  <div className="mw-margin-notes">
    <div className="mw-margin-note" />
  </div>
);

interface IPageProps {
  num: number;
  footnotes: Array<[ number, string ]>;
  title: string;
  flow: any;
}

export default class Page extends React.Component<IPageProps, any> {
  public page: HTMLDivElement;
  public render() {
    let footnotes = [];
    if (this.page && this.props.flow) {
      for (let i = 0; i < this.props.footnotes.length; i++) {
        const footnote = this.props.footnotes[i];
        const region = this.props.flow.regions[i];
        if (this.page.contains(region) && footnote) {
          footnotes = footnotes.concat(footnote);
          continue;
        }
      }
    }
    return (
      <div
        className={`mw-page mw-page-${this.props.num}`}
        ref={e => (this.page = e)}
      >
        <Header title={ this.props.title } />
        <Body footnotes={footnotes} />
        <MarginNotes />
        <Pagination num={this.props.num} />
      </div>
    );
  }
}
