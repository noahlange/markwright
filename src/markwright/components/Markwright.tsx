import * as React from 'react';
import Section from './Section';

interface IMarkwrightProps {
  content: string;
}

export default class Markwright extends React.Component<IMarkwrightProps, any> {
  public state = {
    counts: [1],
    dump: false,
    sections: []
  };

  public addPage = (index: number, pages: number) => {
    const counts = this.state.counts;
    counts[index] = pages;
    this.setState({ counts });
  }

  public makeSections(content) {
    const sections = [];
    const indexes = [];
    const re = /^# (.+)/gim;
    let str = content;
    let match = re.exec(str);
    while (match) {
      const title = match[1];
      indexes.push({ title, index: match.index });
      match = re.exec(str);
    }
    for (const { title, index } of indexes.reverse()) {
      sections.push({ title, content: str.slice(index) });
      str = str.slice(0, index);
    }
    this.setState({
      sections: sections.reverse()
    });
  }

  public componentDidMount() {
    this.makeSections(this.props.content);
  }

  public componentWillReceiveProps(next) {
    if (this.props.content !== next.content) {
      this.makeSections(next.content);
    }
  }

  public render() {
    return (
      <div className="mw">
        {this.state.sections.length ? (
          this.state.sections.map(({ title, content }, idx) => (
            <Section
              idx={idx}
              content={content}
              addPage={this.addPage}
              key={idx}
              title={title}
              start={
                this.state.counts.reduce(
                  (a, b, i) => a + (i < idx ? b : 0),
                  0
                ) || 0
              }
            />
          ))
        ) : (
          <Section
            idx={0}
            addPage={this.addPage}
            key={0}
            title={''}
            start={0}
            content={this.props.content}
          />
        )}
      </div>
    );
  }
}
