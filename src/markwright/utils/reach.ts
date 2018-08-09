export default function recursiveForEach(
  node: any,
  callback: (node: any) => void
) {
  if (node) {
    if (Array.isArray(node)) {
      for (const n of node) {
        recursiveForEach(n, callback);
      }
    }
    callback(node);
    if (node.content) {
      for (const n of node.content) {
        recursiveForEach(n, callback);
      }
    }
  } else {
    return;
  }
}
