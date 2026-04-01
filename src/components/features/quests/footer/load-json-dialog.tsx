import {useState, useRef, useCallback} from "react";
import {CheckIcon, ClipboardTextIcon, ExclamationMarkIcon, FileArrowUpIcon, XIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {toast} from "sonner";

interface LoadJsonDialogProps {
    onApply: (parsed: object) => void
}

export function LoadJsonDialog({onApply}: LoadJsonDialogProps) {
    const [open, setOpen] = useState(false);
    const [pastedJson, setPastedJson] = useState('');
    const loadInputRef = useRef<HTMLInputElement>(null);

    const handleClose = useCallback(() => {
        setOpen(false);
        setPastedJson('');
    }, []);

    const handleLoadFromFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            onApply(parsed);
            toast.success('Quest data loaded from JSON file');
            handleClose();
        } catch {
            toast.error('Invalid JSON file');
        }

        e.target.value = '';
    }, [onApply, handleClose]);

    const handlePasteLoad = useCallback(() => {
        try {
            const parsed = JSON.parse(pastedJson);
            onApply(parsed);
            toast.success('Quest data loaded from JSON');
            handleClose();
        } catch {
            toast.error('Invalid JSON — check the format and try again');
        }
    }, [pastedJson, onApply, handleClose]);

    return (
        <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); else setOpen(true); }}>
            <Button
                variant="ghost"
                size="sm"
                type="button"
                className="hidden md:flex text-muted-foreground gap-1.5"
                onClick={() => setOpen(true)}
            >
                <ClipboardTextIcon />
                Load JSON
            </Button>

            <DialogContent className="gap-3 p-4 sm:max-w-md max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Load Quest from JSON</DialogTitle>
                    <DialogDescription>
                        Import quest data by uploading a file or pasting JSON directly.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
                    <ExclamationMarkIcon className="mt-0.5 size-4 shrink-0 text-amber-500" weight="bold" />
                    <span className="text-amber-600 dark:text-amber-400">
                        This will override <strong>all</strong> current form fields. Your existing changes will be replaced.
                    </span>
                </div>

                <div className="flex flex-col gap-3 overflow-y-auto min-h-0 flex-1">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Upload a JSON file</span>
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="gap-1.5 w-fit"
                            onClick={() => loadInputRef.current?.click()}
                        >
                            <FileArrowUpIcon weight="bold" />
                            Choose File
                        </Button>
                        <input
                            ref={loadInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={handleLoadFromFile}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">Or paste JSON directly</span>
                        <Textarea
                            placeholder='{"title": "My Quest", "quest_type": "kill", ...}'
                            value={pastedJson}
                            onChange={(e) => setPastedJson(e.target.value)}
                            className="font-mono text-xs min-h-24 max-h-60 w-full max-w-full resize-y"
                        />
                    </div>
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
                        disabled={!pastedJson.trim()}
                        onClick={handlePasteLoad}
                    >
                        <CheckIcon size={14} weight="bold" />
                        Apply JSON
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
