declare module 'simple-markdown';
declare type $AnyFixMe = any;

interface IASTNode {
  id?: number | string;
  type: string;
  key?: string;
  content: IASTNode[];
}

interface ISectionNode extends IASTNode {
  title?: IASTNode[];
  type: 'mw-section';
}

interface IHeadingNode extends IASTNode {
  type: 'heading';
  title: IASTNode[];
  level: number;
}

interface IBreakNode extends IASTNode {}

interface IBlockNode extends IASTNode {
  block: string;
  type: 'block';
}
