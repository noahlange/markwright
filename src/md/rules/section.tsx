import type { ReactOutputRule } from 'simple-markdown';

const mwSection: ReactOutputRule = {
  react(node, output) {
    return (
      <section
        key={`section-${node.id}`}
        className={`section section-${node.id}`}
      >
        {output(node.content)}
      </section>
    );
  }
};

export default mwSection;
