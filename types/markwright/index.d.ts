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
}
declare type MarkwrightState = {
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
