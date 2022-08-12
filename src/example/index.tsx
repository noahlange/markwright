import type { Root } from 'react-dom/client';

import './styles.scss';

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import Markwright from '..';

declare global {
  interface Window {
    root: Root;
  }
}

const styles = {
  'theme-mw': 'Classic',
  'theme-none': 'Unstyled',
  'theme-tufte': 'Tuftesque'
};

const docs = {
  'README.md': 'Markwright Readme',
  'moby-dick.md': 'Moby-Dick',
  'the-great-gatsby.md': 'The Great Gatsby'
};

export default function Example(): JSX.Element {
  const [doc, setDoc] = useState(Object.keys(docs)[0]);
  const [style, setStyle] = useState(Object.keys(styles)[0]);
  const [text, setText] = useState('');
  const [y, setY] = useState(0);

  // scroll to the top when there's a major change
  useEffect(() => setY(0), [doc, style]);

  useEffect(() => {
    fetch(`/${doc}`)
      .then(res => res.text())
      .then(text => setText(text));
  }, [doc]);

  return (
    <main>
      <div
        className="preview"
        onWheel={e => setY(val => Math.min(0, val - e.deltaY / 2))}
      >
        <div className={`wrapper`} style={{ transform: `translateY(${y}px)` }}>
          <Markwright className={style} value={text} />
        </div>
      </div>
      <div className="about">
        <h1>markwright</h1>
        <div className="description">
          <div>
            <p>
              <strong>Markwright</strong> is a small (&lt;10KB),
              single-dependency React library for typesetting Markdown
              documents. Features include automatic, CSS column-sensitive
              pagination, document sections, headers, footers, footnotes, block
              elements and page/column breaks. While definitely not a
              replacement for real typesetting software (e.g., LaTeX), it's easy
              to use and will work in a pinch for creating quick-and-dirty
              PDFable representations of Markdown content.
            </p>
            <p>
              Edit the text area below to dynamically update the contents and
              layout of the README.
            </p>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="theme-switcher">Theme</label>
          <select
            id="theme-switcher"
            value={style}
            onChange={e => setStyle(e.currentTarget.value)}
          >
            {Object.entries(styles).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="doc-switcher">Text</label>
          <select
            id="doc-switcher"
            value={doc}
            onChange={e => setDoc(e.currentTarget.value)}
          >
            {Object.entries(docs).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="editor form-group">
          <label htmlFor="doc-content">Content</label>
          <textarea
            id="doc-content"
            className="editor"
            value={text}
            onChange={e => setText(e.currentTarget.value)}
          />
        </div>
        <footer>
          <p>
            Made with ♡ by <a href="https://noahlange.com">Noah Lange</a> in
            Madison, WI.
          </p>
        </footer>
      </div>
    </main>
  );
}

window.root ??= createRoot(document.getElementById('react-root')!);
window.root.render(<Example />);
