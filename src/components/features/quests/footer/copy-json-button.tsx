import {CheckIcon, DownloadSimpleIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {useCallback, useState} from "react";

interface CopyJsonButtonProps {
    values: object
}

export function CopyJsonButton({values}: CopyJsonButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        const json = JSON.stringify(values, null, 2);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [values]);

    return (
        <Button
            variant="ghost"
            size="sm"
            type="button"
            className="text-muted-foreground gap-1.5"
            onClick={handleCopy}
        >
            {copied ? <CheckIcon weight="bold" /> : <DownloadSimpleIcon />}
            {copied ? 'Copied' : 'Copy JSON'}
        </Button>
    );
}
