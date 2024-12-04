"use strict";

import * as React from 'react';
export function useLazyValue(create) {
  const lazyRef = React.useRef();
  if (lazyRef.current === undefined) {
    lazyRef.current = create();
  }
  return lazyRef.current;
}
//# sourceMappingURL=useLazyValue.js.map