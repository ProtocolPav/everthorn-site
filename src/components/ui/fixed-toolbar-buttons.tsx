'use client';

import {
  Baseline,
  BoldIcon,
  Code2Icon,
  Highlighter,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from './indent-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';
import { AlignToolbarButton } from './align-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { LineHeightToolbarButton } from './line-height-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  if (readOnly) return null;

  return (
    <div className="flex w-full overflow-x-auto scrollbar-hide">
      <ToolbarGroup>
        <UndoToolbarButton />
        <RedoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <TurnIntoToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
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
        <NumberedListToolbarButton />
        <BulletedListToolbarButton />
        <TodoListToolbarButton />
        <ToggleToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <TableToolbarButton />
        <MediaToolbarButton nodeType={KEYS.img} />
      </ToolbarGroup>

      <ToolbarGroup>
        <OutdentToolbarButton />
        <IndentToolbarButton />
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
          tooltip="Highlight"
        >
          <Highlighter />
        </FontColorToolbarButton>
        <FontSizeToolbarButton />
        <LineHeightToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MoreToolbarButton />
      </ToolbarGroup>
    </div>
  );
}
