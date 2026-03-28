import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";

export function QuestTitleField() {
    const field = useFieldContext<string>()

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    return (
        <Field className="flex-1 min-w-0">
            <FieldLabel className="sr-only">Quest Title</FieldLabel>
            <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="bg-transparent! text-2xl! tracking-tight! focus-visible:bg-muted! focus-visible:ring-0 hover:bg-muted! px-1.5 border-none font-semibold w-full wrap-break-word placeholder:text-muted-foreground/40"
                placeholder="Untitled quest"
            />
            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}