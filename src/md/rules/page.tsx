import type Page from '../../lib/Page';
import type { Section } from '../../lib/Section';
import type { ReactOutputRule } from 'simple-markdown';

export type RenderFn = (section: Section, page: Page) => JSX.Element;

export const mw: ReactOutputRule = {
  react(node, output) {
    return (
      <div className="mw" key={`mw-${node.id}`}>
        {output(node.content)}
      </div>
    );
  }
};

export const mwPage: ReactOutputRule = {
  react(node, output) {
    const even = node.id % 2 ? 'odd' : 'even';
    return (
      <div
        key={`mw-page-${node.id}`}
        className={`page page-${node.id} ${even}`}
      >
        {output(node.content)}
      </div>
    );
  }
};

export function mwHeader(header: RenderFn): ReactOutputRule {
  return {
    react(node, output) {
      const { section, page } = node.data;
      const key = `mw-${section.number}-header-${page.number}`;
      section.name = output(node.content);
      return <header key={key}>{header(section, page)}</header>;
    }
  };
}

export function mwFooter(footer: RenderFn): ReactOutputRule {
  return {
    react(node, output) {
      const { section, page } = node.data;
      const key = `mw-${section.number}-footer-${page.number}`;
      section.name = output(node.content);
      return <footer key={key}>{footer(section, page)}</footer>;
    }
  };
}
