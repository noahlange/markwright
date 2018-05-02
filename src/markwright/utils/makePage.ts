export default function makePage(
  page: number,
  columns: any | any[],
  footnotes: any[],
  header: any = { type: 'text', content: 'markwright' }
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
