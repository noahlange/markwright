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
}

type MarkwrightState = {
  flowed?: boolean;
  regions: Section[];
};

export default class extends React.Component<
  {
    value: string;
    page?: number;
    config?: IMarkwrightConfig;
  },
  MarkwrightState
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
    return (
      <Markwright
        value={this.props.value}
        page={this.config('page', { width: 96 * 8.5, height: 96 * 11 })}
        manual={this.config('manual', true)}
        columns={
          this.config('manual', true) ? 1 : this.config('columns', 2) || 1
        }
        highlight={this.config('highlight')}
        flowed={this.state.flowed}
        regions={this.state.regions}
        onFlow={r => this.setState({ flowed: true, regions: r })}
      />
    );
  }
}
