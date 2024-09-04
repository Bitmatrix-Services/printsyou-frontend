'use client';

import React, {FC, PropsWithChildren, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

interface IQueryClientProvider {}

export const ReactQueryClientProvider: FC<PropsWithChildren<IQueryClientProvider>> = ({children}) => {
  const [queryClient] = useState(() => {
    return new QueryClient({defaultOptions: {queries: {staleTime: 60 * 1000, retry: false}}});
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
