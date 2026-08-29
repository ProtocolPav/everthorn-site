import { AnimatePresence, motion, Transition } from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import { CheckIcon, FloppyDiskIcon, GearIcon, PencilSimpleIcon, SpinnerIcon, XIcon } from "@phosphor-icons/react";
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
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1],
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
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))] px-4 pointer-events-none">
            <AnimatePresence>
                {scrollVisible && (
                    <motion.div
                        key="scroll-visibility-wrapper"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                        className="pointer-events-auto"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {!isEditing ? (
                                <motion.div
                                    key="edit-trigger"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={swapTransition}
                                    className="overflow-hidden rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                                >
                                    <AnimatePresence mode="wait">
                                        {saveStatus === "success" ? (
                                            <motion.div
                                                key="success-state"
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                className="flex items-center gap-2 h-9 px-4 bg-emerald-600 text-white text-sm"
                                            >
                                                <CheckIcon weight="bold" className="size-4" />
                                                Saved
                                            </motion.div>
                                        ) : (
                                            <motion.div key="edit-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <Button
                                                    size="sm"
                                                    onClick={onEdit}
                                                    className="h-9 px-5 gap-2 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 border border-zinc-900 dark:border-zinc-700 shadow-sm text-sm font-medium"
                                                >
                                                    <PencilSimpleIcon weight="bold" className="size-4" />
                                                    Edit article
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="save-bar"
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    transition={swapTransition}
                                    className="flex items-center gap-1 rounded-lg border border-border bg-card shadow-[0_12px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] p-1.5 w-[calc(100vw-2rem)] max-w-[480px] sm:w-auto"
                                >
                                    <button
                                        onClick={onOpenSettings}
                                        disabled={isSaving}
                                        className="grid size-8 place-items-center rounded-md border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors shrink-0"
                                        aria-label="Page settings"
                                    >
                                        <GearIcon weight="bold" className="size-4" />
                                    </button>

                                    <span className="w-px h-5 bg-border mx-1" aria-hidden />

                                    {hasUnsavedChanges ? (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={isSaving}
                                                    className="flex-1 sm:flex-none gap-1.5 h-8 px-3 rounded-md text-sm"
                                                >
                                                    <XIcon weight="bold" className="size-4" />
                                                    Discard
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-lg">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                                                    <AlertDialogDescription>Your draft edits will be lost. This can’t be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-md">Keep editing</AlertDialogCancel>
                                                    <AlertDialogAction onClick={onCancel} className="rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Discard
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
                                            className="flex-1 sm:flex-none gap-1.5 h-8 px-3 rounded-md text-sm"
                                        >
                                            <XIcon weight="bold" className="size-4" />
                                            Close
                                        </Button>
                                    )}

                                    <Button
                                        size="sm"
                                        onClick={onSave}
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className="flex-1 sm:flex-none gap-1.5 h-8 px-4 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 border border-zinc-900 dark:border-white text-sm font-medium shadow-sm disabled:opacity-50 ml-1"
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
