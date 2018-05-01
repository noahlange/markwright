import * as React from 'react';

export default function divOf(str: string) {
  return {
    react(node, output) {
      return (
        <div key={node.id} className={ str }>
          {output(node.content)}
        </div>
      );
    }
  }
}