export default function recursiveForEach<T extends INode = AnyNode>(
  node: T | T[],
  callback: (node: $AnyFixMe) => void
): void;
