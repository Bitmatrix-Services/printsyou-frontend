'use client';

import posthog from 'posthog-js';
import {PostHogProvider} from 'posthog-js/react';
import {FC, PropsWithChildren} from 'react';

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    // Use reverse proxy to avoid ad blockers (configured in next.config.mjs)
    api_host: '/ingest',
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    debug: false
  });
}

export const CSPostHogProvider: FC<PropsWithChildren> = ({children}) => {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
};
