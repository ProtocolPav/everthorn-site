'use client';

import * as React from 'react';

import type { TLinkElement } from 'platejs';
import { KEYS, NodeApi } from 'platejs';

import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
} from '@platejs/floating';
import { getLinkAttributes } from '@platejs/link';
import {
  type LinkFloatingToolbarState,
  FloatingLinkUrlInput,
  LinkPlugin,
  submitFloatingLink,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from '@platejs/link/react';
import { cva } from 'class-variance-authority';
import { ExternalLink, FileText, Link, List, Search, Text, Unlink } from 'lucide-react';
import {
  useEditorPlugin,
  useEditorRef,
  useEditorSelection,
  useFormInputProps,
  usePluginOption,
} from 'platejs/react';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWikiLinkContext } from '@/components/features/wiki/editor/wiki-link-context.tsx';
import { useListWikiPagesV1GuildsMeWikiGet } from '@/api/nexuscore/wiki-pages/wiki-pages.ts';

const popoverVariants = cva(
  'z-50 w-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden'
);

const inputVariants = cva(
  'flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent md:text-sm'
);

type LinkTab = 'link' | 'page' | 'heading';

function useCurrentPageHeadings(editor: ReturnType<typeof useEditorRef>) {
  return React.useMemo(() => {
    const entries = Array.from(
      editor.api.nodes({
        at: [],
        match: (n) => KEYS.heading.includes((n as { type?: string }).type ?? ''),
      }) ?? []
    ) as Array<[{ id?: string; type?: string }, unknown]>;

    return entries
      .map(([node]) => ({
        id: node.id,
        title: NodeApi.string(node as never),
      }))
      .filter((h) => h.id && h.title.trim().length > 0);
  }, [editor]);
}

export function LinkFloatingToolbar({
  state,
}: {
  state?: LinkFloatingToolbarState;
}) {
  const activeCommentId = usePluginOption({ key: KEYS.comment }, 'activeId');
  const activeSuggestionId = usePluginOption(
    { key: KEYS.suggestion },
    'activeId'
  );
  const editor = useEditorRef();
  const mode = usePluginOption(LinkPlugin, 'mode');
  const { currentSlug } = useWikiLinkContext();
  const { getOptions, setOption } = useEditorPlugin(LinkPlugin);

  const [tab, setTab] = React.useState<LinkTab>('link');
  const [search, setSearch] = React.useState(() =>
    (getOptions().text ?? '').trim()
  );
  const [debounced, setDebounced] = React.useState('');

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const { data: pages, isFetching: pagesLoading } =
    useListWikiPagesV1GuildsMeWikiGet(
      { search: debounced, page_size: 10 },
      { query: { enabled: tab === 'page' && debounced.trim().length > 0 } }
    );

  const headings = useCurrentPageHeadings(editor);

  const applyTarget = React.useCallback(
    (url: string, suggestedText: string) => {
      // Preserve any already-selected / typed display text; only fall back to
      // the page/heading title when there is no text to show.
      const existing = (getOptions().text ?? '').trim();
      const text = existing || suggestedText;
      setOption('url', url);
      setOption('text', text);
      if (mode === 'insert') {
        submitFloatingLink(editor);
      } else {
        setTab('link');
      }
    },
    [editor, mode, getOptions, setOption]
  );

  const selectPage = (slug: string, title: string) => {
    applyTarget(`/wiki/${slug}`, title);
  };

  const selectHeading = (id: string, title: string) => {
    const url = currentSlug ? `/wiki/${currentSlug}#${id}` : `#${id}`;
    applyTarget(url, title);
  };

  const floatingOptions: UseVirtualFloatingOptions = React.useMemo(
    () => ({
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
          padding: 12,
        }),
      ],
      placement:
        activeSuggestionId || activeCommentId ? 'top-start' : 'bottom-start',
    }),
    [activeCommentId, activeSuggestionId]
  );

  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  // Reset transient panel state whenever the popover is fully closed so it
  // reopens on the Link tab with a fresh search seeded from the selection.
  React.useEffect(() => {
    if (hidden) {
      setTab('link');
      setSearch('');
    }
  }, [hidden]);

  if (hidden) return null;

  const showPanels = mode === 'insert' || editState.isEditing;

  const linkInput = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Link className="size-4" />
        </div>

        <FloatingLinkUrlInput
          className={inputVariants()}
          placeholder="Paste link"
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Text className="size-4" />
        </div>
        <input
          className={inputVariants()}
          placeholder="Text to display"
          data-plate-focus
          {...textInputProps}
        />
      </div>
    </div>
  );

  const tabBar = (
    <div className="flex items-center gap-0.5 border-b border-border/60 px-1 pb-1">
      <TabButton active={tab === 'link'} onClick={() => setTab('link')}>
        <Link className="size-3.5" />
        Link
      </TabButton>
      <TabButton active={tab === 'page'} onClick={() => setTab('page')}>
        <FileText className="size-3.5" />
        Page
      </TabButton>
      <TabButton active={tab === 'heading'} onClick={() => setTab('heading')}>
        <List className="size-3.5" />
        Heading
      </TabButton>
    </div>
  );

  const pagePanel = (
    <div className="flex w-[330px] flex-col">
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Search className="size-4" />
        </div>
        <input
          autoFocus
          className={inputVariants()}
          placeholder="Search wiki pages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="max-h-56 overflow-y-auto">
        {debounced.trim().length === 0 ? (
          <EmptyHint>Type to search wiki pages.</EmptyHint>
        ) : pagesLoading ? (
          <EmptyHint>Searching…</EmptyHint>
        ) : pages && pages.length > 0 ? (
          pages.map((page) => (
            <PageResultItem
              key={page.slug}
              title={page.title}
              slug={page.slug}
              onClick={() => selectPage(page.slug, page.title)}
            />
          ))
        ) : (
          <EmptyHint>No pages found.</EmptyHint>
        )}
      </div>
    </div>
  );

  const headingPanel = (
    <div className="flex w-[330px] flex-col">
      <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground">
        Headings on this page
      </div>
      <Separator className="my-1" />
      <div className="max-h-56 overflow-y-auto">
        {headings.length > 0 ? (
          headings.map((h) => (
            <button
              key={h.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectHeading(h.id as string, h.title)}
            >
              <List className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{h.title}</span>
            </button>
          ))
        ) : (
          <EmptyHint>No headings on this page yet.</EmptyHint>
        )}
      </div>
    </div>
  );

  const insertContent = showPanels ? (
    <div className="flex w-[330px] flex-col">
      {tabBar}
      <div className="pt-1">
        {tab === 'link' && linkInput}
        {tab === 'page' && pagePanel}
        {tab === 'heading' && headingPanel}
      </div>
    </div>
  ) : (
    linkInput
  );

  const editContent = editState.isEditing ? (
    <div className="flex w-[330px] flex-col">
      {tabBar}
      <div className="pt-1">
        {tab === 'link' && linkInput}
        {tab === 'page' && pagePanel}
        {tab === 'heading' && headingPanel}
      </div>
    </div>
  ) : (
    <div className="box-content flex items-center">
      <button
        className={buttonVariants({ size: 'sm', variant: 'ghost' })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton />

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: 'sm',
          variant: 'ghost',
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <Unlink width={18} />
      </button>
    </div>
  );

  return (
    <>
      <div ref={insertRef} className={popoverVariants()} {...insertProps}>
        {insertContent}
      </div>

      <div ref={editRef} className={popoverVariants()} {...editProps}>
        {editContent}
      </div>
    </>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={buttonVariants({
        size: 'sm',
        variant: active ? 'secondary' : 'ghost',
      })}
    >
      {children}
    </button>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-3 text-center text-xs text-muted-foreground">
      {children}
    </div>
  );
}

function PageResultItem({
  title,
  slug,
  onClick,
}: {
  title: string;
  slug: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
      onClick={onClick}
    >
      <FileText className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="flex min-w-0 flex-col">
        <span className="truncate">{title}</span>
        <span className="truncate text-[11px] text-muted-foreground">
          /wiki/{slug}
        </span>
      </span>
    </button>
  );
}

function LinkOpenButton() {
  const editor = useEditorRef();
  const selection = useEditorSelection();

  const attributes = React.useMemo(
    () => {
      const entry = editor.api.node<TLinkElement>({
        match: { type: editor.getType(KEYS.link) },
      });
      if (!entry) {
        return {};
      }
      const [element] = entry;
      return getLinkAttributes(editor, element);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  );

  return (
    <a
      {...attributes}
      className={buttonVariants({
        size: 'sm',
        variant: 'ghost',
      })}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      aria-label="Open link in a new tab"
      target="_blank"
    >
      <ExternalLink width={18} />
    </a>
  );
}
