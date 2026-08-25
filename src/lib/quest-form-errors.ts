export interface ValidationError {
    field: string
    message: string
    path: string
}

type FieldMetaWithErrors = {
    errors?: unknown[]
}

export function getValidationErrors(
    fieldMeta: Partial<Record<string, FieldMetaWithErrors | undefined>>,
): ValidationError[] {
    return Object.entries(fieldMeta).flatMap(([path, metadata]) => {
        const message = metadata?.errors
            ?.map(getErrorMessage)
            .find((error): error is string => Boolean(error))

        return message
            ? [
                {
                    path,
                    field: formatFieldName(path),
                    message,
                },
            ]
            : []
    })
}

export function getErrorMessage(error: unknown): string | undefined {
    if (typeof error === 'string') {
        return error
    }

    if (error instanceof Error) {
        return error.message
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return error.message
    }

    return error === true ? 'This field is invalid.' : undefined
}

function formatFieldName(path: string): string {
    const segments = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean)

    const labels: string[] = []

    for (let index = 0; index < segments.length; index++) {
        const segment = segments[index]
        const nextSegment = segments[index + 1]

        if (isArrayIndex(nextSegment)) {
            labels.push(
                `${singularise(toTitleCase(segment))} ${Number(nextSegment) + 1}`,
            )
            index++
            continue
        }

        labels.push(toTitleCase(segment))
    }

    if (labels.length <= 1) {
        return labels[0] ?? 'Form'
    }

    return `${labels.slice(0, -1).join(', ')}: ${labels.at(-1)}`
}

function isArrayIndex(value: string | undefined): value is string {
    return value !== undefined && /^\d+$/.test(value)
}

function singularise(value: string): string {
    if (value.endsWith('ies')) {
        return `${value.slice(0, -3)}y`
    }

    if (value.endsWith('s')) {
        return value.slice(0, -1)
    }

    return value
}

function toTitleCase(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase())
}