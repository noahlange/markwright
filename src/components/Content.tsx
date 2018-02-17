import * as React from 'react';

interface IContentProps {
  content: string;
  id: string;
  observe: (div: HTMLDivElement) => void;
  flow: any;
}

export default class extends React.Component<IContentProps, any> {
  public componentWillReceiveProps(next: IContentProps) {
    if (this.props.flow && this.props.content !== next.content) {
      this.props.flow.relayout();
    }
  }

  public render() {
    return (<div
      ref={this.props.observe}
      className={`mw-content mw-content-${this.props.id}`}
      dangerouslySetInnerHTML={{ __html: this.props.content }}
    />);
  }
}
