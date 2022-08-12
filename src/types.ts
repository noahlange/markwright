import type Page from './lib/Page';
import type { Section } from './lib/Section';

export interface MarkwrightOptions {
  header?: (section: Section, page: Page) => JSX.Element;
  footer?: (section: Section, page: Page) => JSX.Element;
}
