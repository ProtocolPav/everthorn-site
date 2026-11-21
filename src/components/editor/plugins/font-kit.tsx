import type { SlatePluginConfig } from 'platejs';

import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontFamilyPlugin,
  FontSizePlugin,
} from '@platejs/basic-styles/react';
import { KEYS } from 'platejs';

const options = {
  inject: { targetPlugins: [KEYS.p] },
} satisfies SlatePluginConfig;

export const FontKit = [
  FontColorPlugin.configure(options),
  FontBackgroundColorPlugin.configure(options),
  FontSizePlugin.configure(options),
  FontFamilyPlugin.configure(options),
];
