export default function makeCol(id: string, nodes: any[]) {
  return {
    content: nodes,
    id,
    type: 'mw-column',
  };
}