import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    PencilSimpleIcon,
    CheckIcon,
    XIcon,
    SpinnerIcon,
    BookOpenIcon,
    FloppyDiskIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import { useUpdateWikiArticleContent } from "@/hooks/use-wiki.ts";
import { useTheme } from "@/lib/theme-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WikiArticle } from "@/types/wiki.d.ts";
import { useEverthornMember } from "@/hooks/use-everthorn-member.ts";
import { formatDate } from "date-fns";

interface WikiContentEditorProps {
    article: WikiArticle;
    canEdit?: boolean;
}

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const { appTheme } = useTheme();
    const everthornMember = useEverthornMember();

    const updateMutation = useUpdateWikiArticleContent(article.page_id);

    const initialBlocks = useMemo(
        () => article.content?.content ?? [],
        [article.content],
    );

    const editor = useCreateBlockNote({
        initialContent: initialBlocks,
    });

    const handleSave = useCallback(() => {
        updateMutation.mutate(
            {
                content: editor.document,
                edited_by: everthornMember.thornyUser?.thorny_id ?? 0,
            },
            {
                onSuccess: () => {
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
    }, [editor, updateMutation, everthornMember.thornyUser?.thorny_id]);

    const handleCancel = useCallback(() => {
        editor.replaceBlocks(editor.document, initialBlocks);
        setHasUnsavedChanges(false);
        setIsEditing(false);
    }, [editor, initialBlocks]);

    useEffect(() => {
        if (!isEditing) return;
        const el = editorRef.current;
        if (!el) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                if (hasUnsavedChanges) {
                    handleSave();
                }
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
            const hasChanges = JSON.stringify(doc) !== JSON.stringify(initialBlocks);
            setHasUnsavedChanges(hasChanges);
        });

        return () => {
            if (typeof cleanup === "function") {
                cleanup();
            }
        };
    }, [isEditing, editor, initialBlocks]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
    }, []);

    const handleStartWriting = useCallback(() => {
        setIsEditing(true);
        setHasUnsavedChanges(false);
        requestAnimationFrame(() => {
            const editable = editorRef.current?.querySelector<HTMLElement>("[contenteditable]");
            editable?.focus();
        });
    }, []);

    const isSaving = updateMutation.isPending;

    function isArticleContentEmpty(blocks: typeof editor.document): boolean {
        return !blocks || blocks.length === 0;
    }

    const isEmpty = !isEditing && isArticleContentEmpty(editor.document);

    const formattedLastEdited = article.updated_at
        ? formatDate(new Date(article.updated_at), "d MMM, HH:mm")
        : null;

    return (
        <div className="relative" data-slot="wiki-content-editor">
            <AnimatePresence>
                {canEdit && isEditing && (
                    <motion.div
                        key="edit-toolbar"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        {/* Desktop toolbar — top */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 border-b border-border/40">
                            <span
                                className={cn(
                                    "size-2 rounded-full shrink-0 transition-colors duration-300",
                                    hasUnsavedChanges ? "bg-amber-500" : "bg-emerald-500",
                                )}
                            />
                            <span className="text-[11px] font-medium text-muted-foreground/70 tracking-wide uppercase">
                                {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
                            </span>
                            <div className="flex-1" />
                            {formattedLastEdited && (
                                <span className="text-[11px] text-muted-foreground/50 flex items-center gap-1 mr-2">
                                    <ClockIcon weight="regular" className="size-3" />
                                    Edited {formattedLastEdited}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="gap-1.5 h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <XIcon weight="bold" className="size-3.5" />
                                Discard
                                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 bg-muted/60 rounded border border-border/50">
                                    Esc
                                </kbd>
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges}
                                className="gap-1.5 h-8 px-3 text-xs transition-all duration-300"
                            >
                                {isSaving ? (
                                    <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                ) : (
                                    <FloppyDiskIcon weight="bold" className="size-3.5" />
                                )}
                                {isSaving ? "Saving…" : "Save"}
                                {!isSaving && (
                                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 rounded">
                                        ⌘S
                                    </kbd>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Always-visible Edit button in read mode */}
            <AnimatePresence>
                {canEdit && !isEditing && (
                    <motion.div
                        key="edit-button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-2 right-2 z-10"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEdit}
                            className="gap-1.5 h-8 px-2.5 text-xs rounded-md shadow-sm bg-background/60 dark:bg-card/60 backdrop-blur-sm border border-border/30 text-muted-foreground/80 hover:text-foreground hover:bg-accent/80"
                        >
                            <PencilSimpleIcon weight="duotone" className="size-3.5" />
                            <span className="hidden sm:inline">Edit</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editor container */}
            <motion.div
                ref={editorRef}
                className="wiki-content-container"
            >
                <BlockNoteView
                    editor={editor}
                    editable={isEditing}
                    theme={appTheme}
                    className="wiki-blocknote-view"
                    slashMenu
                    sideMenu
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

            {/* Mobile bottom toolbar — visible when editing */}
            <AnimatePresence>
                {canEdit && isEditing && (
                    <motion.div
                        key="mobile-toolbar"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 bg-card border-t border-border/50 shadow-lg backdrop-blur-md">
                            <span
                                className={cn(
                                    "size-2.5 rounded-full shrink-0 transition-colors duration-300",
                                    hasUnsavedChanges ? "bg-amber-500" : "bg-emerald-500",
                                )}
                            />
                            <span className="text-[11px] font-medium text-muted-foreground/70 flex-1 truncate">
                                {hasUnsavedChanges ? "Unsaved changes" : "Saved"}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="h-11 w-11 text-muted-foreground hover:text-foreground"
                            >
                                <XIcon weight="bold" className="size-5" />
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving || !hasUnsavedChanges}
                                className="h-11 px-4 text-sm gap-2 transition-all duration-300"
                            >
                                {isSaving ? (
                                    <SpinnerIcon weight="bold" className="size-3.5 animate-spin" />
                                ) : (
                                    <FloppyDiskIcon weight="bold" className="size-3.5" />
                                )}
                                {isSaving ? "Saving…" : "Save"}
                                {!isSaving && (
                                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 rounded">
                                        ⌘S
                                    </kbd>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
