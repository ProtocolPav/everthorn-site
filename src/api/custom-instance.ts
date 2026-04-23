const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export const customInstance = async <T>(
    url: string,
    {
        method,
        params,
        body,
    }: {
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        params?: any;
        body?: BodyType<unknown>;
        responseType?: string;
    },
): Promise<T> => {
    let targetUrl = `${baseURL}${url}`;

    if (params) {
        targetUrl += '?' + new URLSearchParams(params);
    }

    const response = await fetch(targetUrl, {
        method,
        headers: {
            ...(body !== undefined && { 'Content-Type': 'application/json' }),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // Empty responses (204 No Content, 205, etc.)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        // React Query catches this → routes to `error` instead of `data`
        throw data;
    }

    return data as T;
};

export default customInstance;

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>;

// Wrap the body type if needed (e.g., for case transformation)
export type BodyType<BodyData> = CamelCase<BodyData>;