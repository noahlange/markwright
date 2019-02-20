import React from 'react';
import Region from './lib/Region';
import Section from './lib/Section';
export declare type HighlightFn = (
  content: string,
  lang: string
) => Promise<string>;
declare type MarkwrightProps = {
  context: object;
  manual?: boolean;
  virtualized?: boolean;
  regions: Region[];
  highlight?: HighlightFn;
  flowed: boolean;
  value: string;
  columns: number;
  container: {
    height: number;
    width: number;
  };
  page: {
    width: number;
    height: number;
  };
  onFlow(a: Section[]): void;
};
declare type MarkwrightState = {
  content: string;
  context: object;
  containerHeight: number;
  containerWidth: number;
  flowed: boolean;
  regions: Region[];
  style: string;
};
export default class Markwright extends React.Component<
  MarkwrightProps,
  MarkwrightState
> {
  static ref: HTMLDivElement | null;
  static render(
    content: string,
    context: object,
    page: {
      width: number;
      height: number;
    },
    container: {
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
  ): {
    content: string;
    context: object;
    containerHeight: number;
    containerWidth: number;
    flowed: boolean;
    regions: Region[];
    style: string;
  } | null;
  static flow(manual?: boolean): Section[];
  state: {
    containerHeight: number;
    containerWidth: number;
    content: string;
    context: object;
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
