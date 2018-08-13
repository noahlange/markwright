import * as React from 'react';

export default function divOf(str: string, tag: string = 'div') {
  return {
    react(node, output, state) {
      return React.createElement(tag, {
        children: output(node.content),
        className: str.replace('mw-', ''),
        key: node.id || state.key
      });
    }
  };
}
