import "@blocknote/shadcn/style.css";
import {
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import {
    PencilSimpleIcon,
    BookOpenIcon,
} from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme-provider.tsx";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { PageOut } from "@/api/nexuscore/model";
import {
    usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch,
    invalidateGetWikiPageV1GuildsMeWikiSlugGet,
    invalidateListWikiPagesV1GuildsMeWikiGet,
} from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { useQueryClient } from "@tanstack/react-query";
import { EditorActionBar } from "@/components/features/wiki/editor/editor-action-bar.tsx";
import { CustomSlashMenu } from "@/components/features/wiki/blocks/slash-menu.tsx";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems } from "@blocknote/core";
import { useGetPresignedUploadUrlV1ImagesPresignPost } from "@/api/nexuscore/images/images.ts";
import { WikiPageSettingsDialog, type PageDataDraft } from "@/components/features/wiki/editor/wiki-page-settings-sheet.tsx";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty.tsx";

interface WikiContentEditorProps {
    article: PageOut;
    canEdit?: boolean;
}

function isArticleContentEmpty(blocks: unknown[]): boolean {
    if (!blocks || blocks.length === 0) return true;

    // BlockNote usually initializes with a single empty paragraph block.
    // An empty block looks like: { type: "paragraph", content: [] } or { content: undefined }
    if (blocks.length === 1) {
        const block = blocks[0] as any; // Cast safely to inspect structure

        // If there's no text/inline-content inside the block, it's empty.
        if (!block.content || (Array.isArray(block.content) && block.content.length === 0)) {
            return true;
        }
    }

    return false;
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

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [pageDataDraft, setPageDataDraft] = useState<PageDataDraft>(
        () => articleToPageDataDraft(article)
    );
    const editorRef = useRef<HTMLDivElement>(null);
    const { appTheme } = useTheme();
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
                content_type: file.type as any,
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

    const initialBlocksRef = useRef(structuredClone(article.content?.data ?? []));

    useEffect(() => {
        initialBlocksRef.current = structuredClone(article.content?.data ?? []);
    }, [article.slug, article.content]);

    const {
        audio: _audio,
        video: _video,
        file: _file,
        table: _table,
        ...remainingBlockSpecs
    } = defaultBlockSpecs;
    const schema = BlockNoteSchema.create({
        blockSpecs: {
            ...remainingBlockSpecs,
        },
    });

    const editor = useCreateBlockNote({
        tabBehavior: "prefer-indent",
        initialContent: initialBlocksRef.current,
        uploadFile,
        schema
    });

    // Automatically clear the save status after 3 seconds
    useEffect(() => {
        if (saveStatus !== 'idle') {
            const timer = setTimeout(() => setSaveStatus('idle'), 3000);
            return () => clearTimeout(timer);
        }
    }, [saveStatus]);

    const handleSave = useCallback(() => {
        setSaveStatus('idle'); // reset before new request
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
                        data: editor.document,
                        change_note: "Updated Via Wiki Editor",
                        edited_by: everthornMember.thornyUser?.thorny_id || 0,
                        editor_type: "blocknote",
                    },
                },
            },
            {
                onSuccess: () => {
                    invalidateGetWikiPageV1GuildsMeWikiSlugGet(queryClient, article.slug);
                    invalidateListWikiPagesV1GuildsMeWikiGet(queryClient);

                    initialBlocksRef.current = structuredClone(editor.document);
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
        const freshSnapshot = structuredClone(initialBlocksRef.current);
        editor.replaceBlocks(editor.document, freshSnapshot);
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

    // Keyboard shortcuts and content change tracking
    useEffect(() => {
        if (!isEditing) return;
        const el = editorRef.current;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (hasUnsavedChanges) handleSave();
            }
        };

        const cleanupOnChange = editor.onChange(() => {
            const hasChanges = JSON.stringify(editor.document) !== JSON.stringify(initialBlocksRef.current);
            setHasUnsavedChanges(hasChanges);
        });

        el?.addEventListener("keydown", handleKeyDown);
        return () => {
            el?.removeEventListener("keydown", handleKeyDown);
            if (typeof cleanupOnChange === "function") cleanupOnChange();
        };
    }, [isEditing, editor, hasUnsavedChanges, handleSave, handleCancel]);

    const focusEditorAtEnd = () => {
        requestAnimationFrame(() => {
            const blocks = editor.document;
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock) editor.setTextCursorPosition(lastBlock, "end");
            editor.focus();
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
        setSaveStatus('idle');
        focusEditorAtEnd();
    };

    const isSaving = updateMutation.isPending;
    const isEmpty = !isEditing && isArticleContentEmpty(editor.document);

    return (
        <div className="relative" data-slot="wiki-content-editor">
            <EditorActionBar
                canEdit={canEdit}
                isEditing={isEditing}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                saveStatus={saveStatus} // Pass the new prop to the action bar
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

            {/* Editor container */}
            <motion.div
                ref={editorRef}
                className={`wiki-content-container ${isEditing ? 'wiki-content-editing' : ''}`}
            >
                <BlockNoteView
                    editor={editor}
                    editable={isEditing}
                    theme={appTheme}
                    className="wiki-blocknote-view"
                    formattingToolbar={true}
                    slashMenu={false}
                    sideMenu={false}
                >
                    <SuggestionMenuController
                        triggerCharacter="/"
                        suggestionMenuComponent={CustomSlashMenu}
                        getItems={async (query) =>
                            filterSuggestionItems(getDefaultReactSlashMenuItems(editor), query)
                        }
                    />
                </BlockNoteView>
            </motion.div>

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
                        <Empty className="py-16 md:py-24">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <BookOpenIcon weight="duotone" />
                                </EmptyMedia>
                                <EmptyTitle>This article has no content yet</EmptyTitle>
                                <EmptyDescription>
                                    Be the first to contribute to the wiki!
                                </EmptyDescription>
                            </EmptyHeader>

                            {canEdit && (
                                <EmptyContent className="mt-4">
                                    <Button
                                        onClick={handleEdit}
                                        className="gap-1.5"
                                    >
                                        <PencilSimpleIcon weight="bold" className="size-4" />
                                        Start writing
                                    </Button>
                                </EmptyContent>
                            )}
                        </Empty>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
