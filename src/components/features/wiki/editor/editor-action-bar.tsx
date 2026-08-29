import { AnimatePresence, motion, Transition } from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import { CheckIcon, FloppyDiskIcon, GearIcon, PencilSimpleIcon, SpinnerIcon, XIcon, CommandIcon } from "@phosphor-icons/react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility.ts";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const swapTransition: Transition = {
    duration: 0.18,
    ease: [0.34, 1.56, 0.64, 1],
};

export function EditorActionBar({
    canEdit,
    isEditing,
    isSaving,
    hasUnsavedChanges,
    onEdit,
    onSave,
    onCancel,
    onOpenSettings,
    saveStatus,
}: {
    canEdit: boolean;
    isEditing: boolean;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onOpenSettings: () => void;
    saveStatus?: "idle" | "success" | "error";
}) {
    const isScrollVisible = useScrollVisibility(80);
    const scrollVisible = isEditing || isScrollVisible;

    if (!canEdit) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-100 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] px-4 pointer-events-none">
            <AnimatePresence>
                {scrollVisible && (
                    <motion.div
                        key="scroll-visibility-wrapper"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                        className="pointer-events-auto"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {!isEditing ? (
                                <motion.div
                                    key="edit-trigger"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={swapTransition}
                                    className="rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.16),0_1px_2px_rgba(0,0,0,0.08)] backdrop-blur-xl overflow-hidden border border-border/50"
                                >
                                    <AnimatePresence mode="wait">
                                        {saveStatus === "success" ? (
                                            <motion.div
                                                key="success-state"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                            >
                                                <div className="inline-flex items-center gap-2 h-10 px-5 bg-emerald-600 text-white text-sm font-medium">
                                                    <CheckIcon weight="bold" className="size-4" />
                                                    Saved — welcome back to reading
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="edit-state"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="flex items-center gap-0 bg-card/90"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={onEdit}
                                                    className="gap-2 h-10 px-5 rounded-full text-sm font-medium hover:bg-muted"
                                                >
                                                    <PencilSimpleIcon weight="bold" className="size-4" />
                                                    Edit article
                                                </Button>
                                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground pr-4 border-l border-border/50 ml-1 pl-3">
                                                    <CommandIcon className="size-3" /> + scroll to reveal
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="save-bar"
                                    initial={{ opacity: 0, scale: 0.7, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.7, y: 8 }}
                                    transition={swapTransition}
                                    className="flex items-center gap-1 rounded-full bg-card/95 border border-border/60 shadow-[0_8px_32px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.08)] backdrop-blur-xl p-1.5 w-[calc(100vw-2rem)] max-w-[520px] sm:w-auto"
                                >
                                    {/* Status dot */}
                                    <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-medium pl-3 pr-2">
                                        <span className={`size-2 rounded-full ${hasUnsavedChanges ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                                        {hasUnsavedChanges ? "Unsaved" : "All saved"}
                                    </span>
                                    <div className="hidden sm:block w-px h-5 bg-border/60 mr-1" />

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onOpenSettings}
                                        disabled={isSaving}
                                        className="h-9 w-9 p-0 rounded-full"
                                        title="Page settings"
                                    >
                                        <GearIcon weight="bold" className="size-4" />
                                    </Button>

                                    <div className="w-px h-5 bg-border/60 mx-0.5" />

                                    {hasUnsavedChanges ? (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isSaving}
                                                    className="flex-1 sm:flex-none gap-1.5 h-9 px-4 rounded-full text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <XIcon weight="bold" className="size-4" />
                                                    Discard
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        You have unsaved edits. Discarding will permanently lose them — this cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Keep editing</AlertDialogCancel>
                                                    <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Discard changes
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={onCancel}
                                            disabled={isSaving}
                                            className="flex-1 sm:flex-none gap-1.5 h-9 px-4 rounded-full text-sm"
                                        >
                                            <XIcon weight="bold" className="size-4" />
                                            Done
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        onClick={onSave}
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className="flex-1 sm:flex-none gap-1.5 h-9 px-5 rounded-full text-sm font-medium min-w-28 disabled:opacity-50"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            {isSaving ? (
                                                <motion.span
                                                    key="saving"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <SpinnerIcon weight="bold" className="size-4 animate-spin" />
                                                    Saving…
                                                </motion.span>
                                            ) : (
                                                <motion.span
                                                    key="save"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <FloppyDiskIcon weight="bold" className="size-4" />
                                                    Save
                                                    <span className="hidden sm:inline text-[11px] opacity-60 ml-1">⌘S</span>
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
        </div>
    );
}
