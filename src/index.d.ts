declare module 'simple-markdown';

declare type $AnyFixMe = any;

interface INode {
  content: INode[];
  id?: string;
  type?: string;
  key?: string;
}

interface IHeadingNode extends INode {
  level: number;
  type: 'heading';
}

interface ISectionNode extends INode {
  title?: INode[];
  type: 'mw-section';
}

interface ITextNode extends INode {
  type: 'text';
}

interface IColNode extends INode {
  type: 'mw-column';
}

interface IFootnoteNode extends INode {
  type: 'mw-footnote';
  inline: boolean;
}

interface IColSeparatorNode extends INode {
  type: 'mw-column-separator';
}

type AnyNode =
  | IHeadingNode
  | ISectionNode
  | ITextNode
  | IColNode
  | IColSeparatorNode
  | IFootnoteNode;
