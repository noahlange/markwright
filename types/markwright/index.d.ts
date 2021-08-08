import React from 'react';
import Section from './lib/Section';
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
declare type MarkwrightEntryState = {
  flowed?: boolean;
  regions: Section[];
};
declare type MarkwrightEntryProps = {
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
  state: {
    flowed: boolean;
    regions: never[];
  };
  config<K extends keyof IMarkwrightConfig, P extends IMarkwrightConfig[K]>(
    key: K
  ): P | undefined;
  config<K extends keyof IMarkwrightConfig, P extends IMarkwrightConfig[K]>(
    key: K,
    fallback: P
  ): P;
  render(): JSX.Element;
}
export {};
