export const defaults = {
  columns: 1,
  manual: false
};

export default function styles<T extends typeof defaults>(
  metadata: T,
  width: number,
  height: number
) {
  const o = { ...defaults, ...(metadata as object) };

  const marginInner = 1;
  const marginOuter = 1;
  const marginTop = 1;
  const marginBottom = 1;
  const gutter = 0.5;
  const innerWidth = width - marginInner - marginOuter;

  return `

    :root {
      --page-width: ${width}in;
      --page-height: ${height}in;
      
      --inner-width: ${innerWidth}in;
    
      --col-width: ${(innerWidth - (o.columns - 1) * gutter) / o.columns}in;
      --col-height: calc(${height - marginTop - marginBottom}in - 2rem);
      --col-gutter: ${gutter}in;

      --margin-inner: ${marginInner}in;
      --margin-outer: ${marginOuter}in;
      --margin-top: calc(${marginTop / 2}in - 0.5rem);
      --margin-bottom: calc(${marginBottom / 2}in - 0.5rem);
    }

    html, body {
      padding: 0;
      margin: 0;
    }

    .mw {
      height: var(--page-height);
      width: var(--page-width);
    }
    
    .section {
      display: flex;
      flex-direction: column;
    }

    .section > div {
      outline: none;
    }
    
    .page {
      font-family: var(--font-sans);
      font-size: 15px;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      height: var(--page-height);
      width: var(--page-width);
    }
    
    .odd .header,
    .odd .pagination,
    .odd .body {
      margin-right: var(--margin-inner);
      margin-left: var(--margin-outer);
    }
    
    .even .header,
    .even .pagination,
    .even .body {
      margin-left: var(--margin-inner);
      margin-right: var(--margin-outer);
    }
    
    .header {
      height: 1rem;
      margin-top: var(--margin-top);
      margin-bottom: var(--margin-top);
    }
    
    .pagination {
      height: 1rem;
      margin-top: var(--margin-bottom);
      margin-bottom: var(--margin-bottom);
    }
    
    .body {
      display: flex;
      flex-direction: column;

      width: var(--inner-width);
      flex-basis: var(--col-height);
    }
    .even .header,
    .even .pagination {
      text-align: right;
    }
    
    .odd .header,
    .odd .pagination {
      text-align: left;
    }
    
    .body .content {
      display: flex;
      flex-grow: 1;
      overflow: hidden;
      flex-direction: row;
    }
    
    .column {
      flex: 0 0 var(--col-width);
      min-height: var(--col-height);
      width: var(--col-width);
      height: var(--col-height);
      word-wrap: break-word;
    }
    
    .page-display {
      display: flex;
    }
    
    .page-display > div {
      margin-right: 1rem;
    }
    
    .column-separator {
      display: block;
      border: none;
      height: 100%;
      flex: 0 0 var(--col-gutter);
      margin: 0;
    }
    
    .footnotes:not(.empty) {
      border-top: 1px solid var(--grey-light);
      margin-top: 0.5rem;
      padding-top: 0.5rem;
    }

    .footnote {
      display: block;
    }
    
    pre, code {
      font-family: var(--font-mono);
    }
    
    blockquote {
      padding-left: 0.5rem;
      margin-left: 0.5rem;
    }

    @media screen {
      .page {
        border-radius: 3px;
        background-color: white;
        margin-bottom: 1rem;
      }
    }
  `;
}
