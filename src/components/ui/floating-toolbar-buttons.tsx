'use client';

import {
    Baseline,
    BoldIcon,
    Code2Icon,
    ItalicIcon, PaintBucketIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';
import { AlignToolbarButton } from './align-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';

export function FloatingToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) return null;

  return (
    <>
      <ToolbarGroup>
        <TurnIntoToolbarButton />

        <MarkToolbarButton nodeType={KEYS.bold} tooltip="Bold (⌘+B)">
          <BoldIcon />
        </MarkToolbarButton>

        <MarkToolbarButton nodeType={KEYS.italic} tooltip="Italic (⌘+I)">
          <ItalicIcon />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={KEYS.underline}
          tooltip="Underline (⌘+U)"
        >
          <UnderlineIcon />
        </MarkToolbarButton>

        <MarkToolbarButton
          nodeType={KEYS.strikethrough}
          tooltip="Strikethrough (⌘+⇧+M)"
        >
          <StrikethroughIcon />
        </MarkToolbarButton>

        <MarkToolbarButton nodeType={KEYS.code} tooltip="Code (⌘+E)">
          <Code2Icon />
        </MarkToolbarButton>

        <LinkToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <AlignToolbarButton />
        <FontColorToolbarButton
          nodeType={KEYS.color}
          tooltip="Text color"
        >
          <Baseline />
        </FontColorToolbarButton>
        <FontColorToolbarButton
          nodeType={KEYS.backgroundColor}
          tooltip="Background color"
        >
          <PaintBucketIcon />
        </FontColorToolbarButton>
      </ToolbarGroup>
    </>
  );
}
