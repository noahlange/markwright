export default function recursiveForEach<T extends INode = AnyNode>(
  node: T | T[],
  callback: (node: $AnyFixMe) => void
) {
  if (node) {
    if (Array.isArray(node)) {
      for (const n of node) {
        recursiveForEach(n, callback);
      }
    } else {
      callback(node);
      if (node.content) {
        for (const n of node.content) {
          recursiveForEach(n, callback);
        }
      }
    }
  }
  return;
}
