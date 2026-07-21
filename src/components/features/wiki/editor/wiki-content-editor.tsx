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
    CheckIcon,
    BookOpenIcon,
} from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme-provider.tsx";
import { toast } from "sonner";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { PageOut } from "@/api/nexuscore/model";
import {
    usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch,
    getGetWikiPageV1GuildsMeWikiSlugGetQueryKey,
    getListWikiPagesV1GuildsMeWikiGetQueryKey,
} from "@/api/nexuscore/wiki-pages/wiki-pages.ts";
import { useQueryClient } from "@tanstack/react-query";
import { EditorActionBar } from "@/components/features/wiki/editor/editor-action-bar.tsx";
import { CustomSlashMenu } from "@/components/features/wiki/blocks/slash-menu.tsx";
import { BlockNoteSchema, defaultBlockSpecs, filterSuggestionItems } from "@blocknote/core";
import { useGetPresignedUploadUrlV1ImagesPresignPost } from "@/api/nexuscore/images/images.ts";
import { WikiPageSettingsDialog, type PageDataDraft } from "@/components/features/wiki/editor/wiki-page-settings-sheet.tsx";

interface WikiContentEditorProps {
    article: PageOut;
    canEdit?: boolean;
}

function isArticleContentEmpty(blocks: unknown[]): boolean {
    return !blocks || blocks.length === 0;
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

    const handleSave = useCallback(() => {
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
                    author_id: 1142,
                    project_id: null,
                    content: {
                        data: editor.document,
                        change_note: "aa",
                        edited_by: everthornMember.thornyUser?.thorny_id || 0,
                        editor_type: "blocknote",
                    },
                },
            },
            {
                onSuccess: (updatedPage) => {
                    // Seed the single-page cache with the fresh response so the
                    // article (cover, title, category, etc.) updates instantly.
                    queryClient.setQueryData(
                        getGetWikiPageV1GuildsMeWikiSlugGetQueryKey(article.slug),
                        updatedPage,
                    );

                    // Invalidate the list so the sidebar / index reflects any
                    // title or category changes on the next render.
                    queryClient.invalidateQueries({
                        queryKey: getListWikiPagesV1GuildsMeWikiGetQueryKey(),
                    });

                    initialBlocksRef.current = structuredClone(editor.document);
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
                    setSettingsOpen(false);
                    toast.success("Article saved", {
                        description: "Your changes have been published.",
                        icon: <CheckIcon weight="bold" className="size-4 text-emerald-500" />,
                    });
                },
                onError: () => {
                    toast.error("Failed to save", {
                        description: "Your changes could not be saved. Please try again.",
                    });
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
            if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
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
                        className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground/60"
                    >
                        <div className="flex items-center justify-center size-14 rounded-full bg-muted/30 border border-border/20">
                            <BookOpenIcon weight="duotone" className="size-6 text-muted-foreground/40" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground/70">
                                This article has no content yet.
                            </p>
                            <p className="text-xs text-muted-foreground/40 mt-1">
                                Be the first to contribute to the wiki!
                            </p>
                        </div>
                        {canEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                className="gap-1.5 h-9 text-xs rounded-md"
                            >
                                <PencilSimpleIcon weight="duotone" className="size-3.5" />
                                Start writing
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
