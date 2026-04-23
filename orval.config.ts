import { defineConfig } from 'orval';

export default defineConfig({
    nexuscore: {
        output: {
            mode: 'split',
            client: 'react-query',
            target: './src/api/api.ts',
            override: {
                mutator: {
                    path: './src/api/custom-instance.ts',
                    name: 'customInstance',
                },
            },
        },
        input: {
            target: 'http://localhost:8000/api/openapi.json',
        },
    },
});