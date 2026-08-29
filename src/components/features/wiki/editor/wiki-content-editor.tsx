'use client';

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import {
    PencilSimpleIcon,
    BookOpenIcon,
} from "@phosphor-icons/react";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { PageOut } from "@/api/nexuscore/model";
import {
    usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch,
    invalidateGetWikiPageV1GuildsMeWikiSlugGet,
    invalidateListWikiPagesV1GuildsMeWikiGet,
} from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { useQueryClient } from "@tanstack/react-query";
import { EditorActionBar } from "@/components/features/wiki/editor/editor-action-bar.tsx";
import { useGetPresignedUploadUrlV1ImagesPresignPost } from "@/api/nexuscore/images/images.ts";
import { WikiPageSettingsDialog, type PageDataDraft } from "@/components/features/wiki/editor/wiki-page-settings-sheet.tsx";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { blockNoteToPlateValue, isPlateValueEmpty, DEFAULT_PLATE_VALUE } from "@/components/features/wiki/editor/transforms/blocknote-to-plate.ts";

// Plate
import { usePlateEditor } from "platejs/react";
import { Plate, PlateContent } from "platejs/react";
import { EditorContainer } from "@/components/ui/editor.tsx";
import { FloatingToolbar } from "@/components/ui/floating-toolbar.tsx";
import { FloatingToolbarButtons } from "@/components/ui/floating-toolbar-buttons.tsx";
import { FixedToolbar } from "@/components/ui/fixed-toolbar.tsx";
import { FixedToolbarButtons } from "@/components/ui/fixed-toolbar-buttons.tsx";
import { BasicBlocksKit } from "@/components/editor/plugins/basic-blocks-kit.tsx";
import { BasicMarksKit } from "@/components/editor/plugins/basic-marks-kit.tsx";
import { ListKit } from "@/components/editor/plugins/list-kit.tsx";
import { TableKit } from "@/components/editor/plugins/table-kit.tsx";
import { LinkKit } from "@/components/editor/plugins/link-kit.tsx";
import { MediaKit } from "@/components/editor/plugins/media-kit.tsx";
import { CodeBlockKit } from "@/components/editor/plugins/code-block-kit.tsx";
import { SlashKit } from "@/components/editor/plugins/slash-kit.tsx";
import { DndKit } from "@/components/editor/plugins/dnd-kit.tsx";
import { CalloutKit } from "@/components/editor/plugins/callout-kit.tsx";
import { ColumnKit } from "@/components/editor/plugins/column-kit.tsx";
import { TocKit } from "@/components/editor/plugins/toc-kit.tsx";
import { DateKit } from "@/components/editor/plugins/date-kit.tsx";
import { CodeDrawingKit } from "@/components/editor/plugins/code-drawing-kit.tsx";
import { TextAlignKit } from "@/components/editor/plugins/align-kit.tsx";
import { FontKit } from "@/components/editor/plugins/font-kit.tsx";
import { LineHeightKit } from "@/components/editor/plugins/line-height-kit.tsx";
import type { Value } from "platejs";

interface WikiContentEditorProps {
    article: PageOut;
    canEdit?: boolean;
}

function articleToPageDataDraft(article: PageOut): PageDataDraft {
    return {
        title: article.title,
        summary: article.summary,
        category: article.category,
        tags: [...article.tags],
        cover_image: article.cover_image,
        locked: article.locked,
        published: article.published,
    };
}

function getInitialPlateValue(article: PageOut): Value {
    const raw = article.content?.data as unknown;
    const editorType = (article.content as unknown as { editor_type?: string })?.editor_type;
    if (editorType === "plate" && Array.isArray(raw) && raw.length > 0) {
        return raw as Value;
    }
    // rolling migration: blocknote -> plate
    if (Array.isArray(raw) && raw.length > 0) {
        // heuristic: plate values have type "p"/"h1" etc and listStyleType, blocknote has "paragraph"/"heading"
        const first = raw[0] as Record<string, unknown>;
        if (first && (first.type === "p" || first.type === "h1" || first.type === "h2" || first.type === "blockquote" || first.type === "code_block" || first.type === "img")) {
            return raw as Value;
        }
        return blockNoteToPlateValue(raw);
    }
    return structuredClone(DEFAULT_PLATE_VALUE) as Value;
}

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [pageDataDraft, setPageDataDraft] = useState<PageDataDraft>(
        () => articleToPageDataDraft(article)
    );
    const editorRef = useRef<HTMLDivElement>(null);
    const everthornMember = useEverthornMember();
    const queryClient = useQueryClient();
    const updateMutation = usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch();
    const presignMutation = useGetPresignedUploadUrlV1ImagesPresignPost();

    // Reset draft when navigating to a different page
    useEffect(() => {
        setPageDataDraft(articleToPageDataDraft(article));
    }, [article.slug]);

    const uploadFile = useCallback(async (file: File): Promise<string> => {
        const { upload_url, public_url } = await presignMutation.mutateAsync({
            data: {
                filename: file.name,
                content_type: file.type as never,
            }
        });

        const putRes = await fetch(upload_url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });

        if (!putRes.ok) {
            throw new Error(`Upload to R2 failed: ${putRes.status}`);
        }

        return public_url;
    }, [presignMutation]);

    const initialValue = useMemo(() => getInitialPlateValue(article), [article.slug, article.content]);

    const initialValueRef = useRef<Value>(structuredClone(initialValue) as Value);

    useEffect(() => {
        initialValueRef.current = structuredClone(initialValue) as Value;
    }, [article.slug, initialValue]);

    const platePlugins = useMemo(() => [
        ...BasicBlocksKit,
        ...BasicMarksKit,
        ...ListKit,
        ...TableKit,
        ...LinkKit,
        ...MediaKit,
        ...CodeBlockKit,
        ...CalloutKit,
        ...ColumnKit,
        ...TocKit,
        ...DateKit,
        ...CodeDrawingKit,
        ...TextAlignKit,
        ...FontKit,
        ...LineHeightKit,
        ...SlashKit,
        ...DndKit,
    ], []);

    const editor = usePlateEditor({
        value: initialValue as Value,
        plugins: platePlugins,
    });

    // Keep editor value in sync when article changes (navigation) — reset without remount
    useEffect(() => {
        // When article slug changes, replace editor content
        const next = getInitialPlateValue(article);
        initialValueRef.current = structuredClone(next) as Value;
        // plate editor: replace nodes
        // Use tf.setValue if available, otherwise replace
        try {
            // @ts-ignore - plate's API has setValue via tf
            if (editor.tf && typeof (editor.tf as unknown as { setValue?: (v: Value) => void }).setValue === 'function') {
                (editor.tf as unknown as { setValue: (v: Value) => void }).setValue(next as Value);
            } else {
                // fallback: remove all and insert
                editor.tf.replaceNodes(next as Value, { at: [], children: true } as unknown as Record<string, unknown>);
            }
        } catch {
            // ignore
        }
        setHasUnsavedChanges(false);
        setIsEditing(false);
    }, [article.slug, editor, article]);

    // Automatically clear the save status after 3 seconds
    useEffect(() => {
        if (saveStatus !== 'idle') {
            const timer = setTimeout(() => setSaveStatus('idle'), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleSave = useCallback(() => {
        setSaveStatus('idle');
        const value = editor.children as unknown as Value;
        updateMutation.mutate(
            {
                slug: article.slug,
                data: {
                    ...article,
                    title: pageDataDraft.title,
                    summary: pageDataDraft.summary,
                    category: pageDataDraft.category,
                    tags: pageDataDraft.tags,
                    cover_image: pageDataDraft.cover_image,
                    locked: pageDataDraft.locked,
                    published: pageDataDraft.published,
                    content: {
                        data: value as unknown as never[],
                        change_note: "Updated Via Wiki Editor",
                        edited_by: everthornMember.thornyUser?.thorny_id || 0,
                        editor_type: "plate",
                    },
                },
            },
            {
                onSuccess: () => {
                    invalidateGetWikiPageV1GuildsMeWikiSlugGet(queryClient, article.slug);
                    invalidateListWikiPagesV1GuildsMeWikiGet(queryClient);
                    initialValueRef.current = structuredClone(value) as Value;
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
                    setSettingsOpen(false);
                    setSaveStatus('success');
                },
                onError: () => {
                    setSaveStatus('error');
                },
            },
        );
    }, [editor, updateMutation, article, pageDataDraft, everthornMember.thornyUser?.thorny_id, queryClient]);

    const handleCancel = useCallback(() => {
        const fresh = structuredClone(initialValueRef.current) as Value;
        try {
            if (editor.tf && typeof (editor.tf as unknown as { setValue?: (v: Value) => void }).setValue === 'function') {
                (editor.tf as unknown as { setValue: (v: Value) => void }).setValue(fresh);
            } else {
                editor.tf.replaceNodes(fresh as unknown as never[], { at: [], children: true } as unknown as Record<string, unknown>);
            }
        } catch {
            // fallback
        }
        setPageDataDraft(articleToPageDataDraft(article));
        setHasUnsavedChanges(false);
        setIsEditing(false);
        setSettingsOpen(false);
        setSaveStatus('idle');
    }, [editor, article]);

    // Track page data draft changes as unsaved
    useEffect(() => {
        if (!isEditing) return;
        const pageDataChanged =
            pageDataDraft.title !== article.title ||
            pageDataDraft.summary !== article.summary ||
            pageDataDraft.category !== article.category ||
            JSON.stringify(pageDataDraft.tags) !== JSON.stringify(article.tags) ||
            pageDataDraft.cover_image !== article.cover_image ||
            pageDataDraft.locked !== article.locked ||
            pageDataDraft.published !== article.published;
        if (pageDataChanged) setHasUnsavedChanges(true);
    }, [pageDataDraft, isEditing, article]);

    // Keyboard shortcuts (Cmd+S)
    useEffect(() => {
        if (!isEditing) return;
        const el = editorRef.current;
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (hasUnsavedChanges) handleSave();
            }
        };
        el?.addEventListener("keydown", handleKeyDown);
        return () => {
            el?.removeEventListener("keydown", handleKeyDown);
        };
    }, [isEditing, hasUnsavedChanges, handleSave]);

    const focusEditorAtEnd = () => {
        requestAnimationFrame(() => {
            try {
                editor.tf.focus({ edge: "end" } as unknown as Record<string, unknown>);
            } catch {
                editor.tf.focus();
            }
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
        setSaveStatus('idle');
        focusEditorAtEnd();
    };

    const isSaving = updateMutation.isPending;
    // Use editor.children for empty check (reactive); fallback to initialValue when editor not ready
    const currentValue = (editor.children as unknown as Value) ?? initialValue;
    const isEmpty = !isEditing && isPlateValueEmpty(currentValue);

    return (
        <div className="relative" data-slot="wiki-content-editor">
            <EditorActionBar
                canEdit={canEdit}
                isEditing={isEditing}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                saveStatus={saveStatus}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            <WikiPageSettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                data={pageDataDraft}
                onChange={(updated) => setPageDataDraft((prev) => ({ ...prev, ...updated }))}
                uploadFile={uploadFile}
            />

            {/* Editor — no card, true WYSIWYG */}
            <div
                ref={editorRef}
                className={`wiki-content-container wiki-plate-view ${isEditing ? 'wiki-content-editing' : ''}`}
            >
                <Plate
                    editor={editor}
                    onChange={({ value }) => {
                        if (!isEditing) return;
                        const hasChanges = JSON.stringify(value) !== JSON.stringify(initialValueRef.current) ||
                            JSON.stringify(pageDataDraft) !== JSON.stringify(articleToPageDataDraft(article));
                        // also check pageDataDraft diff
                        const pageDirty = pageDataDraft.title !== article.title ||
                            pageDataDraft.summary !== article.summary ||
                            pageDataDraft.category !== article.category ||
                            JSON.stringify(pageDataDraft.tags) !== JSON.stringify(article.tags) ||
                            pageDataDraft.cover_image !== article.cover_image ||
                            pageDataDraft.locked !== article.locked ||
                            pageDataDraft.published !== article.published;
                        setHasUnsavedChanges(hasChanges || pageDirty);
                    }}
                >
                    {isEditing && (
                        <FixedToolbar className="rounded-lg">
                            <FixedToolbarButtons />
                        </FixedToolbar>
                    )}
                    <EditorContainer
                        className="wiki-plate-view border-0 bg-transparent p-0 shadow-none overflow-hidden rounded-xl"
                        variant="default"
                    >
                        <PlateContent
                            className="wiki-plate-content min-h-[14rem] px-4 md:px-6 py-4 focus:outline-none text-[0.9375rem] leading-[1.55] font-light whitespace-break-spaces break-words"
                            placeholder={isEditing ? "Press / for commands..." : undefined}
                            readOnly={!isEditing}
                            disableDefaultStyles
                        />
                        {isEditing && (
                            <FloatingToolbar className="wiki-editor-toolbar">
                                <FloatingToolbarButtons />
                            </FloatingToolbar>
                        )}
                    </EditorContainer>
                </Plate>
            </div>

            {/* Empty state */}
            <AnimatePresence>
                {isEmpty && (
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <Empty className="py-10 md:py-16 rounded-2xl border border-dashed border-border/60 bg-muted/10 mt-4">
                            <EmptyHeader>
                                <EmptyMedia variant="icon" className="bg-amber-500/10 text-amber-700 dark:text-amber-300">
                                    <BookOpenIcon weight="duotone" />
                                </EmptyMedia>
                                <EmptyTitle className="font-almendra text-xl">This chronicle is unwritten</EmptyTitle>
                                <EmptyDescription className="max-w-md">
                                    No ink has touched this page yet. Be the first to record its tale for the archives.
                                </EmptyDescription>
                            </EmptyHeader>

                            {canEdit && (
                                <EmptyContent className="mt-4">
                                    <Button
                                        onClick={handleEdit}
                                        className="gap-1.5 rounded-md px-5"
                                    >
                                        <PencilSimpleIcon weight="bold" className="size-4" />
                                        Start writing
                                    </Button>
                                    <p className="text-[11px] text-muted-foreground mt-2">Your words will be saved to the Chronicles</p>
                                </EmptyContent>
                            )}
                        </Empty>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
