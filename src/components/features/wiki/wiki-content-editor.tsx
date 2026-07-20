import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    PencilSimpleIcon,
    CheckIcon,
    XIcon,
    SpinnerIcon,
    BookOpenIcon,
    FloppyDiskIcon,
} from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme-provider";
import { toast } from "sonner";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import {PageOut} from "@/api/nexuscore/model";
import {usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch} from "@/api/nexuscore/wiki-pages/wiki-pages.ts";

interface WikiContentEditorProps {
    article: PageOut;
    canEdit?: boolean;
}

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const { appTheme } = useTheme();
    const everthornMember = useEverthornMember();

    const updateMutation = usePartialUpdateWikiPageV1GuildsMeWikiSlugPatch();

    // Immutable snapshot captured once per article — never mutated, never reused directly
    const initialBlocksRef = useRef(
        structuredClone(article.content?.data ?? [])
    );

    // If the underlying article changes (e.g. navigating to a different wiki page), re-snapshot
    useEffect(() => {
        initialBlocksRef.current = structuredClone(article.content?.data ?? []);
    }, [article.slug, article.content]);

    const editor = useCreateBlockNote({
        initialContent: initialBlocksRef.current,
    });

    const handleSave = useCallback(() => {
        updateMutation.mutate(
            {
                slug: article.slug,
                data: {
                    ...article,
                    author_id: 1142,
                    project_id: null,
                    content: { data: editor.document, change_note: "aa", edited_by: everthornMember.thornyUser?.thorny_id || 0, editor_type: "blocknote" },
                },
            },
            {
                onSuccess: () => {
                    // Save succeeded — the current document IS the new "initial" state
                    initialBlocksRef.current = structuredClone(editor.document);
                    setHasUnsavedChanges(false);
                    setIsEditing(false);
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
    }, [editor, updateMutation, article]);

    const handleCancel = useCallback(() => {
        // Always pass a fresh clone — never the same object twice
        const freshSnapshot = structuredClone(initialBlocksRef.current);
        editor.replaceBlocks(editor.document, freshSnapshot);
        setHasUnsavedChanges(false);
        setIsEditing(false);
    }, [editor]);

    useEffect(() => {
        if (!isEditing) return;
        const el = editorRef.current;
        if (!el) return;

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

        el.addEventListener("keydown", handleKeyDown);
        return () => el.removeEventListener("keydown", handleKeyDown);
    }, [isEditing, hasUnsavedChanges, handleSave, handleCancel]);

    useEffect(() => {
        if (!isEditing) return;

        const cleanup = editor.onChange(() => {
            const doc = editor.document;
            const hasChanges = JSON.stringify(doc) !== JSON.stringify(initialBlocksRef.current);
            setHasUnsavedChanges(hasChanges);
        });

        return () => {
            if (typeof cleanup === "function") cleanup();
        };
    }, [isEditing, editor]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
        requestAnimationFrame(() => {
            const blocks = editor.document;
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock) {
                editor.setTextCursorPosition(lastBlock, "end");
            }
            editor.focus();
        });
    }, []);

    const handleStartWriting = useCallback(() => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
        requestAnimationFrame(() => {
            const blocks = editor.document;
            const lastBlock = blocks[blocks.length - 1];
            if (lastBlock) {
                editor.setTextCursorPosition(lastBlock, "end");
            }
            editor.focus();
        });
    }, [editor]);

    const isSaving = updateMutation.isPending;

    function isArticleContentEmpty(blocks: typeof editor.document): boolean {
        return !blocks || blocks.length === 0;
    }

    const isEmpty = !isEditing && isArticleContentEmpty(editor.document);

    return (
        <div className="relative" data-slot="wiki-content-editor">
            {/* Mobile edit button — read mode only */}
            <AnimatePresence>
                {canEdit && !isEditing && (
                    <motion.div
                        key="mobile-edit-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="sm:hidden absolute top-2 right-2 z-50"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEdit}
                            className="gap-1.5 h-8 w-8 rounded-md shadow-sm bg-background/60 dark:bg-card/60 backdrop-blur-sm border border-border/30 text-muted-foreground/80 hover:text-foreground hover:bg-accent/80"
                        >
                            <PencilSimpleIcon weight="duotone" className="size-3.5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile bottom bar — edit mode only */}
            <AnimatePresence>
                {canEdit && isEditing && (
                    <motion.div
                        key="mobile-bar"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        className="sm:hidden justify-end fixed bottom-0 left-0 right-0 z-50 flex items-center gap-2 px-4 py-3 bg-card/95 border-t border-border/50 shadow-2xl backdrop-blur-md"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="h-10 w-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/60"
                        >
                            <XIcon weight="bold" className="size-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving || !hasUnsavedChanges}
                            className="h-10 px-5 text-sm gap-2 min-w-20"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isSaving ? (
                                    <motion.span
                                        key="saving"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                        Saving…
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="save"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <FloppyDiskIcon weight="bold" className="size-3.5" />
                                        Save
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop controls — sm and above only */}
            <AnimatePresence>
                {canEdit && (
                    <motion.div
                        key="desktop-controls"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="hidden sm:flex items-center gap-1.5 absolute top-2 right-2 z-1"
                    >
                        <AnimatePresence initial={false}>
                            {isEditing && (
                                <motion.div
                                    key="discard"
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="gap-1.5 h-8 px-2.5 text-xs rounded-md shadow-sm bg-background/60 dark:bg-card/60 backdrop-blur-sm border border-border/30 text-muted-foreground/70 hover:text-foreground hover:bg-accent/80 whitespace-nowrap"
                                    >
                                        <XIcon weight="bold" className="size-3" />
                                        Discard
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait" initial={false}>
                            {!isEditing ? (
                                <motion.div
                                    key="edit"
                                    layoutId="desktop-primary-action"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleEdit}
                                        className="gap-1.5 h-8 px-2.5 text-xs rounded-md shadow-sm bg-background/60 dark:bg-card/60 backdrop-blur-sm border border-border/30 text-muted-foreground/80 hover:text-foreground hover:bg-accent/80"
                                    >
                                        <PencilSimpleIcon weight="duotone" className="size-3.5" />
                                        Edit
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="save"
                                    layoutId="desktop-primary-action"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className="gap-1.5 h-8 px-3 text-xs whitespace-nowrap min-w-[68px] transition-opacity duration-150"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isSaving ? (
                                                <motion.span
                                                    key="saving"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                                    Saving…
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="save"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <FloppyDiskIcon weight="bold" className="size-3.5" />
                                                    Save
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    formattingToolbar
                    slashMenu={true}
                    sideMenu={false}
                />
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
                                onClick={handleStartWriting}
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
