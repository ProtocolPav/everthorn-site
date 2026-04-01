import {useState, useCallback} from "react";
import {CheckIcon, CodeIcon, ExclamationMarkIcon, WarningIcon, XIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {toast} from "sonner";

interface EditRawDialogProps {
    values: object
    onApply: (parsed: object) => void
}

export function EditRawDialog({values, onApply}: EditRawDialogProps) {
    const [open, setOpen] = useState(false);
    const [rawJson, setRawJson] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleOpen = useCallback(() => {
        setRawJson(JSON.stringify(values, null, 2));
        setError(null);
        setOpen(true);
    }, [values]);

    const handleClose = useCallback(() => {
        setOpen(false);
        setError(null);
    }, []);

    const handleApply = useCallback(() => {
        try {
            const parsed = JSON.parse(rawJson);
            onApply(parsed);
            setError(null);
            setOpen(false);
            toast.success('Raw JSON applied to form');
        } catch {
            setError('Invalid JSON. Fix the syntax errors before applying');
        }
    }, [rawJson, onApply]);

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); else handleOpen(); }}>
            <Button
                variant="ghost"
                size="sm"
                type="button"
                className="hidden md:flex text-muted-foreground gap-1.5"
                onClick={handleOpen}
            >
                <CodeIcon />
                Edit Raw
            </Button>

            <DialogContent className="gap-3 p-4 sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit Raw JSON</DialogTitle>
                    <DialogDescription>
                        Directly edit the quest form data as JSON. Changes apply immediately to all fields.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm shrink-0">
                    <WarningIcon className="mt-0.5 size-4 shrink-0 text-amber-500" weight="fill" />
                    <span className="text-amber-600 dark:text-amber-400">
                        Expert mode — invalid JSON or malformed data can break the form. Proceed with caution.
                    </span>
                </div>

                {error && (
                    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm shrink-0">
                        <ExclamationMarkIcon className="mt-0.5 size-4 shrink-0 text-destructive" weight="bold" />
                        <span className="text-destructive">{error}</span>
                    </div>
                )}

                <div className="flex flex-col gap-1.5 min-h-0 flex-1 overflow-hidden">
                    <span className="text-xs font-medium text-muted-foreground">Full form state</span>
                    <Textarea
                        value={rawJson}
                        onChange={(e) => { setRawJson(e.target.value); setError(null); }}
                        className="font-mono text-xs min-h-64 max-h-[50vh] w-full max-w-full resize-y flex-1 overflow-auto"
                        spellCheck={false}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-1 shrink-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={handleClose}
                    >
                        <XIcon size={14} />
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        type="button"
                        onClick={handleApply}
                    >
                        <CheckIcon size={14} weight="bold" />
                        Apply Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
