import {AnimatePresence, motion, Transition} from "motion/react";
import { Button } from "@/components/ui/button.tsx";
import { FloppyDiskIcon, PencilSimpleIcon, SpinnerIcon, XIcon } from "@phosphor-icons/react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility.ts";

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
}: {
    canEdit: boolean;
    isEditing: boolean;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    const scrollVisible = useScrollVisibility(80);

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
                                    className="rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-md p-1"
                                >
                                    <Button size="sm" onClick={onEdit} className="gap-2 h-9 px-4 rounded-xl">
                                        <PencilSimpleIcon weight="bold" className="size-4" />
                                        Edit article
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="save-bar"
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={swapTransition}
                                    className="flex items-center gap-2 rounded-2xl bg-card border border-border/50 shadow-2xl backdrop-blur-md px-3 py-2.5 w-[calc(100vw-2rem)] max-w-md sm:w-auto"
                                >
                                    <span className="hidden sm:inline text-xs text-muted-foreground pl-1 pr-2 whitespace-nowrap">
                                        {hasUnsavedChanges ? "Unsaved changes" : "Editing"}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={onCancel}
                                        disabled={isSaving}
                                        className="flex-1 sm:flex-none gap-1.5 h-9 px-4 text-sm"
                                    >
                                        <XIcon weight="bold" className="size-4" />
                                        Discard
                                    </Button>

                                    <Button
                                        size="sm"
                                        onClick={onSave}
                                        disabled={isSaving || !hasUnsavedChanges}
                                        className="flex-1 sm:flex-none gap-1.5 h-9 px-4 text-sm min-w-24"
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