import Section from '../lib/Section';
/**
 * returns a modified abstract syntax tree more closely representing the final
 * output instead of the markdown document
 * .mw
 *   .section
 *     .page
 *       .header
 *       .body
 *         .content
 *         .footnotes
 *       .pagination
 */
export default function transformAST(
  ast: AnyNode[],
  flow?: Section[],
  columns?: number
): ISectionNode[];
