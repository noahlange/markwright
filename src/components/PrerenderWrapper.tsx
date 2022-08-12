import type { PropsWithChildren } from 'react';

import React from 'react';

export const PrerenderWrapper = React.forwardRef<
  HTMLDivElement,
  PropsWithChildren<{}>
>((props, ref) => {
  return (
    <div
      className="mw"
      style={{ position: 'absolute', left: -10000 }}
      ref={ref}
    >
      {props.children}
    </div>
  );
});
