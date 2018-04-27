import { assign, escapeHtml, unescapeAll } from 'markdown-it/lib/common/utils';

export default function divfence(md) {
  function render(tokens, idx, options, env, slf) {
    const token = tokens[idx];
    const info = token.info ? unescapeAll(token.info).trim() : '';
    let langName;
    let i;
    let tmpAttrs;
    let tmpToken;

    if (info) {
      langName = info.split(/\s+/g)[0];
    }
    const highlighted = md.render(token.content);

    if (info) {
      i = token.attrIndex('class');
      tmpAttrs = token.attrs ? token.attrs.slice() : [];

      if (i < 0) {
        tmpAttrs.push(['class', `block block-${ langName }`]);
      } else {
        tmpAttrs[i][1] += ' ' + `block block-${ langName }`;
      }

      // Fake token just to render attributes
      tmpToken = {
        attrs: tmpAttrs
      };

      return (
        `<div${ slf.renderAttrs(tmpToken) }>${ highlighted }</div>\n`
      );
    }

    return (
      `<div class="block ${slf.renderAttrs(token)}">${ highlighted }</div>\n`
    );
  }

  function fence(state, startLine, endLine, silent) {
    let marker;
    let len;
    let mem;
    let params;
    let nextLine;
    let token;
    let markup;
    let haveEndMarker = false;
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];

    // if it's indented more than 3 spaces, it should be a code block
    if (state.sCount[startLine] - state.blkIndent >= 4) {
      return false;
    }

    if (pos + 3 > max) {
      return false;
    }

    marker = state.src.charCodeAt(pos);

    if (marker !== 58) {
      return false;
    }

    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);

    len = pos - mem;

    if (len < 3) {
      return false;
    }

    markup = state.src.slice(mem, pos);
    params = state.src.slice(pos, max);

    if (params.indexOf(String.fromCharCode(marker)) >= 0) {
      return false;
    }

    // Since start is found, we can report success here in validation mode
    if (silent) {
      return true;
    }

    // search end of block
    nextLine = startLine;

    do {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - :::
        //  test
        break;
      }

      if (state.src.charCodeAt(pos) !== marker) {
        continue;
      }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }

      pos = state.skipChars(pos, marker);

      // closing code fence must be at least as long as the opening one
      if (pos - mem < len) {
        continue;
      }

      // make sure tail has spaces only
      pos = state.skipSpaces(pos);

      if (pos < max) {
        continue;
      }

      haveEndMarker = true;
      // found!
      break;
    } while (true);

    len = state.sCount[startLine];

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    token = state.push('container', 'div', 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    return true;
  }
  md.renderer.rules.container = render;
  md.block.ruler.before('fence', 'container', fence, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
}
