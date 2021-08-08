export default function makeCol(id: string, nodes: AnyNode): IColNode {
  return {
    content: [nodes],
    id,
    type: 'mw-column'
  };
}
