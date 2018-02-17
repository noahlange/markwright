# markwright
A small React library for automagically typesetting Markdown.

## Peer dependencies
- [CSS Regions polyfill](https://github.com/FremyCompany/css-regions-polyfill)
- [React](https://reactjs.org) 16+

You'll need to include the CSS regions polyfill in your document because the
spec has been dumped by (virtually) all the major browser vendors.

## Use

It's pretty straightforward.

```jsx
import * as React from 'react';
import { render } from 'react-dom';

const root = document.getElementById('root');
const md =
  '# SUCH SECTION \\n very content.^[wow!]';
const mw = <Markwright content={ md } />;

render(mw, root);
```

## Styling and HTML structure
Markwright documents are unstyled, but structured as follows.
```
.mw                               // document
  .mw-section                     // sections
    .mw-page                      // page
      .mw-header                  // header
      .mw-body                    // body
        .mw-contents              // inline
          .mw-column              // col-left
          .mw-column-separator    // separator
          .mc-column              // col-right
        .mw-footnotes             // footnotes
      .mw-pagination              // pagination
```

This allows you to customize the relative position/dimensions of each
component `div` as desired.

## Markdown syntax extensions
Markwright bundles several Markdown-It extensions for common typesetting
usecases.

### Custom HTML attributes

Markwright includes the `markdown-it-attrs` extension. It allows for the
application of arbitrary attributes onto your document nodes. Documentation is
available at [the project's repo](https://github.com/arve0/markdown-it-attrs).
```
# Such Header {.very-style}
paragraph {data-toggle=modal}
```

### Footnotes
A generic auto-numbering footnote implementation. They're automatically inserted
into the containing page's `.mw-footnotes` container.

```
three red panda moons^[are great, by the way].
```

### Blocks
Arbitrary `div`s can be created using triple colons — `:::`. This creates a div
and applies a `block block-foo` class onto the node, where `foo` is whatever
directly follows the opening triple colons.

```
:::foo
This will be wrapped in \`.block-foo\`.
:::
```

This allows you to more explicitly separate sidebars, &c. from body content.