import { MarkdownIt } from 'markdown-it';
import { generate } from 'shortid';

export default function footnote(md: MarkdownIt) {
  const parseLinkLabel = md.helpers.parseLinkLabel;

  // ^[ FOOTNOTE ]
  function inline_footnote(state, silent) {
    const start = state.pos;
    const max = state.posMax;
    let token;
    const tokens = [];

    if (start + 2 >= max) {
      return false;
    }
    if (state.src.charCodeAt(start) !== 0x5e) {
      return false;
    }
    if (state.src.charCodeAt(start + 1) !== 0x5b) {
      return false;
    }
    const labelStart = start + 2;
    const labelEnd = parseLinkLabel(state, start + 1);
    if (labelEnd < 0) {
      return false;
    }

    if (!silent) {
      if (!state.env.footnotes) {
        state.env.footnotes = {};
      }
      if (!state.env.footnotes.list) {
        state.env.footnotes.list = [];
      }
      const id = state.env.footnotes.list.length;
      state.md.inline.parse(
        state.src.slice(labelStart, labelEnd),
        state.md,
        state.env,
        tokens
      );
      token = state.push('footnote_inline', '', 0);
      token.meta = { id };
      token.content = state.src.slice(labelStart, labelEnd);
      state.env.footnotes.list[id] = { tokens };
    }

    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }

  function render_inline_footnote(tokens, idx, options, env, renderer) {
    return `<div class="footnote footnote-${tokens[idx].meta.id + 1}">${
      tokens[idx].content
    }</div>`;
  }

  md.renderer.rules.footnote_inline = render_inline_footnote;
  md.inline.ruler.after('image', 'footnote_inline', inline_footnote as any);
}
