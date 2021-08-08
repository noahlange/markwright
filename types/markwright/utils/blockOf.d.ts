import React from 'react';
export default function divOf(
  str: string,
  tag?: string
): {
  react(
    node: any,
    output: any,
    state: any
  ): React.DOMElement<
    {
      children: any;
      className: string;
      key: any;
    },
    Element
  >;
};
