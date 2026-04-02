import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PencilSimpleIcon, CheckIcon, XIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useUpdateWikiArticleContent } from "@/hooks/use-wiki";
import { useTheme } from "@/lib/theme-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WikiArticle } from "@/types/wiki";

interface WikiContentEditorProps {
    article: WikiArticle;
    canEdit?: boolean;
}

export function WikiContentEditor({ article, canEdit = false }: WikiContentEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const hasLoadedContent = useRef(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const { appTheme } = useTheme();

    const updateMutation = useUpdateWikiArticleContent(article.page_id);

    const editor = useCreateBlockNote();

    // Parse HTML into blocks once article content is available
    useEffect(() => {
        if (!editor || hasLoadedContent.current) return;

        const loadContent = async () => {
            if (article.content) {
                const blocks = await editor.tryParseHTMLToBlocks(article.content);
                editor.replaceBlocks(editor.document, blocks);
            }
            hasLoadedContent.current = true;
            setIsInitialized(true);
        };

        loadContent();
    }, [editor, article.content]);

    const handleSave = useCallback(async () => {
        const html = await editor.blocksToHTMLLossy(editor.document);
        updateMutation.mutate(html, {
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

    const handleCancel = useCallback(async () => {
        if (article.content) {
            const blocks = await editor.tryParseHTMLToBlocks(article.content);
            editor.replaceBlocks(editor.document, blocks);
        } else {
            editor.replaceBlocks(editor.document, []);
        }
        setIsEditing(false);
    }, [editor, article.content]);

    // Keyboard shortcuts when editing
    useEffect(() => {
        if (!isEditing || !editorRef.current) return;

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

        const el = editorRef.current;
        el.addEventListener("keydown", handleKeyDown);
        return () => el.removeEventListener("keydown", handleKeyDown);
    }, [isEditing, handleSave, handleCancel]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    if (!isInitialized) {
        return <EditorSkeleton />;
    }

    const isSaving = updateMutation.isPending;

    return (
        <div className="relative group/wiki-editor" ref={editorRef}>
            {/* Edit bar */}
            {canEdit && (
                <div
                    className={cn(
                        "flex items-center justify-end gap-2 mb-3",
                        "transition-all duration-200",
                        isEditing
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-1 group-hover/wiki-editor:opacity-100 group-hover/wiki-editor:translate-y-0"
                    )}
                >
                    {!isEditing ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEdit}
                            className="gap-1.5 h-7 px-2.5 text-xs text-muted-foreground/70 hover:text-foreground"
                        >
                            <PencilSimpleIcon weight="duotone" className="size-3.5" />
                            Edit
                            <kbd className="ml-0.5 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 bg-muted/60 rounded border border-border/50">
                                ⌘E
                            </kbd>
                        </Button>
                    ) : (
                        <>
                            <span className="mr-auto text-[10px] uppercase tracking-widest font-semibold text-primary/60 animate-in fade-in slide-in-from-left-2 duration-200">
                                Editing
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="gap-1.5 h-7 px-2.5 text-xs text-muted-foreground/70 hover:text-foreground"
                            >
                                <XIcon className="size-3.5" />
                                Discard
                                <kbd className="ml-0.5 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 bg-muted/60 rounded border border-border/50">
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
                        </>
                    )}
                </div>
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
            {!isEditing && !article.content && (
                <div className="flex flex-col items-start gap-2 py-6 text-muted-foreground/60">
                    <p className="text-sm italic">This article has no content yet.</p>
                    {canEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="gap-1.5 h-7 text-xs"
                        >
                            <PencilSimpleIcon weight="duotone" className="size-3.5" />
                            Start writing
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

function EditorSkeleton() {
    const widths = [100, 92, 100, 78, 100, 65, 88, 100, 72];
    return (
        <div className="space-y-2.5 py-2">
            {widths.map((w, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-[0.875rem] rounded bg-muted/50 animate-pulse",
                        i === 0 && "mt-0",
                        i > 2 && i < 5 && "h-[0.625rem]"
                    )}
                    style={{ width: `${w}%` }}
                />
            ))}
        </div>
    );
}
