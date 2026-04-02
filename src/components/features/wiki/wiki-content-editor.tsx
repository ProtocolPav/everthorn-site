import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { PencilSimpleIcon, CheckIcon, XIcon, SpinnerIcon, BookOpenIcon } from "@phosphor-icons/react";
import { useUpdateWikiArticleContent } from "@/hooks/use-wiki";
import { useTheme } from "@/lib/theme-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WikiArticle } from "@/types/wiki";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

interface WikiContentEditorProps {
    article: WikiArticle;
    canEdit?: boolean;
}

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const { appTheme } = useTheme();
    const everthornMember = useEverthornMember();

    const updateMutation = useUpdateWikiArticleContent(article.page_id);

    const initialBlocks = article.content?.content;

    const editor = useCreateBlockNote({
        initialContent: initialBlocks,
    });

    useEffect(() => {
        if (!isEditing) return;
        const el = document.querySelector<HTMLElement>(".wiki-content-editing");
        if (!el) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
            if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
            }
        };

        el.addEventListener("keydown", handleKeyDown);
        return () => el.removeEventListener("keydown", handleKeyDown);
    });

    const handleSave = useCallback(() => {
        updateMutation.mutate({content: editor.document, edited_by: everthornMember.thornyUser?.thorny_id || 0}, {
            onSuccess: () => {
                setIsEditing(false);
                toast.success("Article saved", {
                    description: "Your changes have been published.",
                });
            },
            onError: () => {
                toast.error("Failed to save", {
                    description: "Your changes could not be saved. Please try again.",
                });
            },
        });
    }, [editor, updateMutation]);

    const handleCancel = useCallback(() => {
        editor.replaceBlocks(editor.document, initialBlocks ?? []);
        setIsEditing(false);
    }, [editor, initialBlocks]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const isSaving = updateMutation.isPending;

    return (
        <div className="relative group/wiki-editor">
            {/* Edit toolbar — visible when editing */}
            <AnimatePresence>
                {canEdit && isEditing && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center gap-2 px-2 py-2 border-b border-border/30"
                    >
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-primary/60">
                            Editing
                        </span>
                        <div className="flex-1" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="gap-1.5 h-7 px-2.5 text-xs text-muted-foreground/70 hover:text-foreground"
                        >
                            <XIcon className="size-3.5" />
                            <span className="hidden sm:inline">Discard</span>
                            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 bg-muted/60 rounded border border-border/50">
                                Esc
                            </kbd>
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-1.5 h-7 px-3 text-xs"
                        >
                            {isSaving ? (
                                <SpinnerIcon className="size-3.5 animate-spin" />
                            ) : (
                                <CheckIcon weight="bold" className="size-3.5" />
                            )}
                            {isSaving ? "Saving…" : "Save"}
                            {!isSaving && (
                                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 rounded">
                                    ⌘S
                                </kbd>
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating edit button — shown on hover when not editing */}
            {canEdit && !isEditing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute top-1 right-1 z-10 opacity-0 group-hover/wiki-editor:opacity-100 transition-opacity duration-200"
                >
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleEdit}
                        className="gap-1.5 h-7 px-2.5 text-xs rounded-full shadow-sm bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-background text-muted-foreground/80 hover:text-foreground"
                    >
                        <PencilSimpleIcon weight="duotone" className="size-3.5" />
                        Edit
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 text-[9px] font-mono text-muted-foreground/50 bg-muted/60 rounded border border-border/50">
                            ⌘E
                        </kbd>
                    </Button>
                </motion.div>
            )}

            {/* Editor container */}
            <div
                className={cn(
                    "wiki-content-container",
                    "transition-[outline-color,box-shadow] duration-200",
                    isEditing && "wiki-content-editing"
                )}
            >
                <BlockNoteView
                    editor={editor}
                    editable={isEditing}
                    theme={appTheme}
                    className="wiki-blocknote-view"
                />
            </div>

            {/* Empty state */}
            <AnimatePresence>
                {!isEditing && !article.content && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground/60"
                    >
                        <div className="flex items-center justify-center size-12 rounded-full bg-muted/40 border border-border/30">
                            <BookOpenIcon weight="duotone" className="size-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium">This article has no content yet.</p>
                        {canEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                className="gap-1.5 h-8 text-xs rounded-full"
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
