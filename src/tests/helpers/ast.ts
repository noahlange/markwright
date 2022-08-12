import type { ASTNode, SingleASTNode } from 'simple-markdown';
import { reach } from '../../md/utils';

export function getNodes(type: string, ast: ASTNode): SingleASTNode[] {
  const nodes: SingleASTNode[] = [];
  reach(ast, node => {
    if (node.type === type) {
      nodes.push(node);
    }
  });
  return nodes;
}

export function hasNodes(type: string, ast: ASTNode, count?: number): boolean {
  const nodes: SingleASTNode[] = [];
  reach(ast, node => {
    if (node.type === type) {
      nodes.push(node);
    }
  });

  return count ? nodes.length === count : nodes.length > 1;
}
