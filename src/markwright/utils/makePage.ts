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
        id: `page-${page}-header`,
        type: 'mw-header'
      },
      {
        content: [
          {
            content: columns,
            id: `page-${page}-content`,
            type: 'mw-content'
          },
          {
            content: footnotes.map(f => ({ ...f, inline: false })),
            id: `page-${page}-footnotes`,
            type: 'mw-footnotes'
          }
        ],
        id: `page-${page}-body`,
        type: 'mw-body'
      }
    ],
    id: page,
    type: 'mw-page'
  };
}
