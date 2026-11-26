export function getSubmitErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message
    }

    if (typeof error !== 'object' || error === null) {
        return 'An unexpected error occurred while saving the quest.'
    }

    const value = error as {
        response?: {
            data?: {
                detail?: string | Array<{ msg?: string }>
                message?: string
            }
        }
        detail?: string | Array<{ msg?: string }>
        message?: string
    }

    const detail = value.response?.data?.detail ?? value.detail

    if (typeof detail === 'string') {
        return detail
    }

    if (Array.isArray(detail)) {
        const messages = detail
            .map((item) => item.msg)
            .filter((message): message is string => Boolean(message))

        if (messages.length > 0) {
            return messages.join(' ')
        }
    }

    return (
        value.response?.data?.message ??
        value.message ??
        'An unexpected error occurred while saving the quest.'
    )
}