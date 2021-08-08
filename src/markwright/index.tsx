import React from 'react';
import Section from './lib/Section';
import Markwright from './Markwright';
import valueful from './utils/valueful';

interface IMarkwrightConfig {
  manual?: boolean;
  columns?: number;
  page?: {
    width: number;
    height: number;
  };
  highlight?: (str: string, language: string) => Promise<string>;
  virtualized?: boolean;
}

type MarkwrightEntryState = {
  flowed?: boolean;
  regions: Section[];
};

type MarkwrightEntryProps = {
  value: string;
  page?: number;
  context?: object;
  config?: IMarkwrightConfig;
  container?: Partial<{
    height: number;
    width: number;
  }>;
};

export default class extends React.Component<
  MarkwrightEntryProps,
  MarkwrightEntryState
> {
  public state = { flowed: false, regions: [] };

  public config<
    K extends keyof IMarkwrightConfig,
    P extends IMarkwrightConfig[K]
  >(key: K): P | undefined;
  public config<
    K extends keyof IMarkwrightConfig,
    P extends IMarkwrightConfig[K]
  >(key: K, fallback: P): P;
  public config<
    K extends keyof IMarkwrightConfig,
    P extends IMarkwrightConfig[K]
  >(key: K, fallback?: P) {
    return this.props.config
      ? valueful(this.props.config[key])
        ? this.props.config[key]
        : fallback
      : fallback;
  }

  public render() {
    const container = {
      ...{
        height: window.innerHeight,
        width: 96 * 8.5
      },
      ...(this.props.container || {})
    };
    return (
      <Markwright
        value={this.props.value}
        context={this.props.context || {}}
        container={container}
        page={this.config('page', { width: 96 * 8.5, height: 96 * 11 })}
        manual={this.config('manual', true)}
        columns={
          this.config('manual', true) ? 1 : this.config('columns', 2) || 1
        }
        highlight={this.config('highlight')}
        flowed={this.state.flowed}
        regions={this.state.regions}
        virtualized
        onFlow={r => this.setState({ flowed: true, regions: r })}
      />
    );
  }
}
