import { getNexuscoreToken } from './nexuscore-token'

export interface ErrorType<T> {
    status: number
    data: T
}

export const nexuscoreFetcher = async <T>(
    url: string,
    options?: RequestInit,
    _params?: unknown,
    signal?: AbortSignal,
): Promise<T> => {
    // Calls the server function — token never exposed to client bundle
    const token = await getNexuscoreToken()

    const baseUrl = import.meta.env.VITE_NEXUSCORE_API_URL

    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        signal,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options?.headers,
        },
    })

    if (!response.ok) {
        throw { status: response.status, data: await response.json() }
    }

    return response.json()
}