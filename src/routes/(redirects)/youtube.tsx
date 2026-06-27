import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/(redirects)/youtube')({
    loader: () => {
        throw redirect({
            href: 'https://www.youtube.com/@EverthornMC',
            statusCode: 302, // Non Permanent Redirect
        })
    },
})
