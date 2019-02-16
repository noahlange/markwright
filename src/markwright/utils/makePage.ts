export default function makePage(
  page: number,
  columns: $AnyFixMe | $AnyFixMe[],
  footnotes: $AnyFixMe[],
  header: IASTNode[] = [{ type: 'text', content: [] }]
) {
  return {
    content: [
      {
        content: header,
        id: `mw-page-${page}-header`,
        type: 'mw-header'
      },
      {
        content: [
          {
            content: columns,
            id: `mw-page-${page}-content`,
            type: 'mw-content'
          },
          {
            content: footnotes.map(f => ({ ...f, inline: false })),
            id: `mw-page-${page}-footnotes`,
            type: 'mw-footnotes'
          }
        ],
        id: `mw-page-${page}-body`,
        type: 'mw-body'
      }
    ],
    id: page,
    type: 'mw-page'
  };
}
