import { defineConfig } from 'orval';

export default defineConfig({
    nexuscore: {
        output: {
            mode: 'split',
            client: 'react-query',
            target: './src/api/api.ts',
            baseUrl: {
                runtime: 'import.meta.env.VITE_NEXUSCORE_API_URL',
            },
        },
        input: {
            target: 'http://localhost:8000/api/openapi.json',
        },
    },
});