export default function recursiveForEach(
  node: IASTNode | IASTNode[],
  callback: (node: $AnyFixMe) => void
): void {
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
}
