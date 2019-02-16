export default function makeCol(id: string, nodes: IASTNode[]) {
  return {
    content: nodes,
    id,
    type: 'mw-column'
  };
}
