import React from 'react';
import Region from './lib/Region';
import Section from './lib/Section';
export declare type HighlightFn = (
  content: string,
  lang: string
) => Promise<string>;
declare type MarkwrightProps = {
  manual?: boolean;
  virtualized?: boolean;
  regions: Section[];
  highlight?: HighlightFn;
  flowed: boolean;
  value: string;
  columns: number;
  page: {
    width: number;
    height: number;
  };
  onFlow(a: Section[]): void;
};
declare type MarkwrightState = {
  content: string;
  flowed: boolean;
  regions: Region[];
  style: string;
};
export default class Markwright extends React.Component<
  MarkwrightProps,
  MarkwrightState
> {
  static ref: HTMLDivElement | null;
  static rules: $AnyFixMe;
  static react(
    content: string,
    page?: {
      width: number;
      height: number;
    },
    regions?: $AnyFixMe[],
    columns?: number,
    highlight?: HighlightFn
  ): JSX.Element;
  static reactVirtualized(
    content: string,
    page: {
      width: number;
      height: number;
    },
    regions?: Section[],
    columns?: number,
    highlight?: HighlightFn
  ): JSX.Element;
  static getDerivedStateFromProps(
    props: MarkwrightProps,
    state: MarkwrightState
  ):
    | {
        content: string;
        flowed: boolean;
        regions: never[];
      }
    | {
        flowed: boolean;
        regions: Section[];
        content?: undefined;
      }
    | null;
  static flow(manual?: boolean): Section[];
  state: {
    content: string;
    flowed: boolean;
    regions: never[];
    style: string;
  };
  reflow(): void;
  componentDidUpdate(): void;
  componentDidMount(): void;
  render(): JSX.Element;
}
export {};
