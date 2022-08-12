# markwright

A small (<10 KB), single-dependency[^a] React library for automagically typesetting Markdown documents.

```bash
$ npm i markwright
```

Basic usage:

```jsx
import Markwright from 'markwright';
import { createRoot } from 'react-dom/client';

const res = await fetch('/moby-dick.md');
const text = await res.text();

createRoot(document.getElementById('main'))
  .render(<Markwright value={text} />);
```

## Styling and HTML structure

Markwright's default stylesheet is a good starter for minimalist documents. Page and margin sizes can be set with the following CSS variables.

```css
--page-height: 11in;
--page-width: 8.5in;
--margin-inner: 0.5in;
--margin-outer: 0.5in;
--margin-top: 0.5in;
--margin-bottom: 0.5in;
```

More complex styles can take advantage of Markwright's unopinionated HTML output and custom CSS.

```
.section section-n
  .page page-n
    .header
    .body
      .content
      .footnotes
    .footer
```

## Markdown extensions

A handful of helpful features have been added to the Markdown parser used by
Markwright. These include footnotes and content blocks.

### Footnotes

Markwright supports GFM-style footnotes[^b]. They're automatically inserted
into the containing page's `.footnotes` container and reset after each page.

### Blocks

Colon-fenced containers (`:::`) create `<div />` elements for nesting content. This creates a container with the class name after the first colons.

```
::: foo
Block accessible as `div.foo`.
:::
```

This allows you to more explicitly separate sidebars, &c. from body content.

### Breaks

Along with the standard line-break (`<br />`), two custom elements enable page and column breaks.

- `<br-page />`: page break
- `<br-col />`: column break in a multi-column layout

_Caveat emptor_, inserting a column break into a page's final column may have unpredictable effects.

[^a]: Excluding `react` and `react-dom`.
[^b]: See the [GitHub docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#footnotes) for more information.
