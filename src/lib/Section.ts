import type Page from './Page';
import type { ReactNode } from 'react';

export class Section {
  public readonly pages: Page[] = [];
  public readonly number: number;
  public readonly start: number;
  public name: ReactNode = null;

  public constructor(section: number, start: number) {
    this.number = section;
    this.start = start;
  }

  public get ids(): string[] {
    return this.pages.flatMap(page => page.ids);
  }

  public add(page: Page): void {
    this.pages.push(page);
  }
}
