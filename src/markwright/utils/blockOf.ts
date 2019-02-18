import React from 'react';

export default function divOf(str: string, tag: string = 'div') {
  return {
    react(node: $AnyFixMe, output: $AnyFixMe, state: $AnyFixMe) {
      return React.createElement(tag, {
        children: output(node.content),
        className: str.replace('mw-', ''),
        key: node.id || state.key
      });
    }
  };
}
