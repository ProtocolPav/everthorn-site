import {defineConfig} from 'vite'
import {tanstackStart} from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {nitro} from 'nitro/vite'
import posthog from "@posthog/rollup-plugin"

const config = defineConfig({
    server: {allowedHosts: [".everthorn.net", "localhost", ".ts.net"]},
    resolve: {tsconfigPaths: true},
    plugins: [
        nitro({ preset: 'bun' }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        posthog({
            personalApiKey: process.env.POSTHOG_PERSONAL_KEY!,
            projectId: process.env.POSTHOG_PROJECT_ID,
            host: process.env.VITE_PUBLIC_POSTHOG_HOST,
            sourcemaps: {
                enabled: true,
                releaseName: 'everthorn-tanstack',
                releaseVersion: '1.0.0',
                deleteAfterUpload: true,
            },
        }),
    ],
    optimizeDeps: {
        exclude: ['@resvg/resvg-js', '@resvg/resvg-js-darwin-arm64'],
    },
})

export default config
