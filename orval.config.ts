import { defineConfig } from 'orval'

export default defineConfig({
    nexuscore: {
        input: {
            target: 'http://localhost:8000/api/openapi.json',
        },
        output: {
            mode: 'tags-split',          // one file per OpenAPI tag
            target: './src/api/nexuscore',
            schemas: './src/api/nexuscore/model',
            client: 'react-query',
            httpClient: 'fetch',
            override: {
                fetch: {
                    includeHttpResponseReturnType: false,
                },
                mutator: {
                    path: './src/lib/nexuscore-fetcher.ts',
                    name: 'nexuscoreFetcher',
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                    useInfinite: true,
                    useInfiniteQueryParam: 'page',
                    useInvalidate: true,
                    // Makes generated hooks use your exact staleTime etc. defaults
                    options: {
                        staleTime: 5 * 60 * 1000,
                        gcTime: Infinity,
                        refetchOnWindowFocus: false,
                    },
                }
            },
        },
    },
})