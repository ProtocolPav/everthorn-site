'use client';

import * as React from 'react';

import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from '@platejs/link/react';
import { Link } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ToolbarButton } from './toolbar';

export function LinkToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const state = useLinkToolbarButtonState();
  const { props: buttonProps } = useLinkToolbarButton(state);
  const editor = useEditorRef();

  // Clicking the button after blurring the editor (e.g. dismissing the link
  // popover by clicking away) can leave editor.selection null, which makes the
  // floating-link trigger early-return and the popover never reappear. Ensure a
  // selection exists before triggering.
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!editor.selection) {
        try {
          editor.tf.select(editor.api.start([]));
        } catch {
          // empty document — ignore
        }
      }
      (buttonProps.onClick as ((e: React.MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
    },
    [editor, buttonProps.onClick]
  );

  return (
    <ToolbarButton
      {...props}
      {...buttonProps}
      // Keep the editor focused so dismissing/opening the popover doesn't drop
      // the selection.
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      data-plate-focus
      tooltip="Link"
    >
      <Link />
    </ToolbarButton>
  );
}
