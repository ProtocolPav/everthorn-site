'use client';

import * as React from 'react';

interface WikiLinkContextValue {
  currentSlug: string | null;
}

const WikiLinkContext = React.createContext<WikiLinkContextValue>({
  currentSlug: null,
});

export function WikiLinkProvider({
  currentSlug,
  children,
}: {
  currentSlug: string | null;
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ currentSlug }),
    [currentSlug]
  );
  return (
    <WikiLinkContext.Provider value={value}>
      {children}
    </WikiLinkContext.Provider>
  );
}

export function useWikiLinkContext(): WikiLinkContextValue {
  return React.useContext(WikiLinkContext);
}
