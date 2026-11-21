import { useFieldContext } from "@/hooks/use-form-context.ts";

export function useFieldValidity() {
    const field = useFieldContext();
    const isTouched = field.state.meta.isTouched;
    const isValid = field.state.meta.isValid;
    const errors = field.state.meta.errors;

    return {
        isInvalid: isTouched && !isValid,
        isTouched,
        isValid,
        errors,
    };
}
