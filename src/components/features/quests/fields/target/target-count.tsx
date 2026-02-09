import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";

interface TargetCountProps {
    className?: string;
    placeholder?: string;
}

export function TargetCountField({placeholder, className}: TargetCountProps) {
    const field = useFieldContext<string>()
    const [randomNumber] = useState<number>(Math.round(Math.random() * 60))

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className={cn(className, "flex-1 w-20 min-w-0")}>
            <FieldLabel className="sr-only">Quest Title</FieldLabel>
            <Input
                type={'number'}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={placeholder ? placeholder : `${randomNumber}`}
                className={cn("placeholder:text-muted-foreground/20", isInvalid ? "ring-2 ring-destructive" : "")}
            />
        </Field>
    )
}