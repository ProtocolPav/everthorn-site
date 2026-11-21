import type { FieldMeta } from "@tanstack/react-form";

export function fieldMetaHasErrors(
    fieldMeta: Record<string, FieldMeta<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>>,
    prefix: string,
): boolean {
    return Object.keys(fieldMeta).some(key => {
        if (!key.startsWith(prefix)) return false;
        const meta = fieldMeta[key];
        return meta.errors && meta.errors.length > 0;
    });
}

export function fieldMetaHasErrorsTouched(
    fieldMeta: Record<string, FieldMeta<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>>,
    prefix: string,
    submitted: boolean,
): boolean {
    return Object.keys(fieldMeta).some(key => {
        if (!key.startsWith(prefix)) return false;
        const meta = fieldMeta[key];
        return (meta.isTouched || submitted) && meta.errors && meta.errors.length > 0;
    });
}
