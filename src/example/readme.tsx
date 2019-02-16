/* tslint:disable */

export const content = `# markwright
A small (6.5 KB), minimal-dependency React library for automagically typesetting Markdownesque documents.

\`\`\`bash
$ yarn add markwright
\`\`\`

\`\`\`jsx
import Markwright from 'markwright';
import React from 'react';
import { render } from 'react-dom';

const root = document.getElementById('root');
const md = '# SECTION! \\n very content.^[wow!]';
const mw = <Markwright content={ md } />;

render(mw, root);
\`\`\`

## Styling and HTML structure
If you choose not to use the default stylesheet, you'll need to bring your own styling. Follow  general structure of the Markwright document and the CSS as a guide.

This lack of prescription allows you to customize the position/dimensions of each component \`div\` as desired.

## Markdown additions
A handful of helpful features have been added to the Markdown parser used by Markwright. These include footnotes^[wow such footnotes!] and blocks^[footnotes on footnotes on footnotes!].

### Footnotes
A generic auto-numbering footnote implementation. They're automatically inserted into the containing page's \`.mw-footnotes\` container.

\`\`\`
three red panda moons^[are great, by the way].
\`\`\`

### Blocks
Arbitrary \`div\`s can be created using triple colons — \`:::\`. This creates a div and applies a \`block block-foo\` class onto the node, where \`foo\` is whatever directly follows the opening triple colons.

\`\`\`
:::foo
This will be wrapped in \`.block.block-foo\`.
:::
\`\`\`

This allows you to more explicitly separate sidebars, &c. from body content.

### Breaks
\`{.break}\` will insert a column break in content.
`;
