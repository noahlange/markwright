import * as React from 'react';
import Markwright from './Markwright';

interface IMarkwrightConfig {
  manual?: boolean;
  columns?: number;
  highlight?: (str: string, language: string) => Promise<string>;
}

export default class extends React.Component<{
  value: string;
  config?: IMarkwrightConfig;
}> {
  public state = { flowed: false, regions: [] };
  public config(key: keyof IMarkwrightConfig, fallback?: any) {
    const valueful = v => v !== undefined && v !== null;
    return this.props.config
      ? valueful(this.props.config[key])
        ? this.props.config[key]
        : fallback
      : fallback;
  }
  public render() {
    return (
      <Markwright
        value={this.props.value}
        manual={this.config('manual', false)}
        columns={this.config('manual', false) ? 1 : this.config('columns', 2)}
        highlight={this.config('highlight')}
        flowed={this.state.flowed}
        regions={this.state.regions}
        onFlow={r => this.setState({ flowed: true, regions: r })}
      />
    );
  }
}
