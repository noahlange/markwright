import * as React from 'react';
import Markwright from './Markwright';

export default class extends React.Component<{
  content: string;
  columns?: number;
}> {
  public state = { flowed: false, regions: [] };
  public render() {
    return (
      <Markwright
        content={this.props.content}
        flowed={this.state.flowed}
        regions={this.state.regions}
        onFlow={r => this.setState({ flowed: true, regions: r })}
      />
    );
  }
}
