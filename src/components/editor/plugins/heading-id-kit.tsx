'use client';

import { NodeIdPlugin } from '@platejs/core';
import { KEYS } from 'platejs';

export const HeadingIdKit = [
  NodeIdPlugin.configure({
    options: {
      idKey: 'id',
      reuseId: true,
      initialValueIds: 'always',
      filter: ([node]) =>
        KEYS.heading.includes((node as { type?: string }).type ?? ''),
    },
  }),
];
