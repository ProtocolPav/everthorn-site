import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import posthog from '@posthog/rollup-plugin'

const config = defineConfig(({ command }) => {
    const plugins = [
        nitro({ preset: 'bun' }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ]

    if (command === 'build') {
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

        plugins.push({
            ...posthogPlugin,
            name: posthogPlugin.name ?? 'posthog-rollup-plugin',
            applyToEnvironment: (env: { name: string }) =>
                env.name === 'client',
        })
    }

    return {
        server: {
            allowedHosts: ['.everthorn.net', 'localhost', '.ts.net'],
        },
        resolve: {
            tsconfigPaths: true,
        },
        build: {
            sourcemap: true,
        },
        plugins,
        optimizeDeps: {
            exclude: ['@resvg/resvg-js', '@resvg/resvg-js-darwin-arm64'],
        },
    }
})

export default config