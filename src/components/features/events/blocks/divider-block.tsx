import type { DividerBlock as DividerBlockType } from '@/api/nexuscore/model'
import {Separator} from "@/components/ui/separator.tsx";

interface DividerBlockProps {
    block: DividerBlockType
}

// @ts-ignore
export function DividerBlock({ block }: DividerBlockProps) {
    return (
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-4">
            <Separator/>
        </div>
    )
}
