import {defineConfig} from 'vite'
import {tanstackStart} from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {nitro} from 'nitro/vite'

const config = defineConfig({
    server: {allowedHosts: [".everthorn.net", "localhost", ".ts.net"]},
    resolve: {tsconfigPaths: true},
    plugins: [
        nitro({ preset: 'bun' }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ],
    optimizeDeps: {
        exclude: ['@resvg/resvg-js', '@resvg/resvg-js-darwin-arm64'],
    },
})

export default config
