import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import posthog from '@posthog/rollup-plugin'

// Instantiate the PostHog plugin separately so we can scope it to the
// "client" Vite Environment only. Without this, Nitro/TanStack Start's
// Environments API build runs the plugin against client + ssr + server
// environments, causing duplicate/mismatched symbol set uploads and
// chunk-id injection that doesn't match what's actually served to the
// browser.
const posthogPlugin = posthog({
    personalApiKey: process.env.POSTHOG_PERSONAL_KEY!,
    projectId: process.env.POSTHOG_PROJECT_ID,
    host: process.env.VITE_PUBLIC_POSTHOG_HOST,
    sourcemaps: {
        enabled: true,
        releaseName: 'everthorn-tanstack',
        releaseVersion: process.env.RELEASE_VERSION,
        deleteAfterUpload: true,
    },
})

const config = defineConfig({
    server: { allowedHosts: ['.everthorn.net', 'localhost', '.ts.net'] },
    resolve: { tsconfigPaths: true },
    build: { sourcemap: true },
    plugins: [
        nitro({ preset: 'bun' }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
        {
            ...posthogPlugin,
            name: posthogPlugin.name ?? 'posthog-rollup-plugin',
            // Only run source map upload / chunkId injection for the
            // client (browser) build. Skip ssr/server environments.
            applyToEnvironment: (env: { name: string }) => env.name === 'client',
        },
    ],
    optimizeDeps: {
        exclude: ['@resvg/resvg-js', '@resvg/resvg-js-darwin-arm64'],
    },
})

export default config