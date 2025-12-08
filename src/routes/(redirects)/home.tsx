import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/(redirects)/home')({
    loader: () => {
        throw redirect({
            href: '/',
            statusCode: 302, // Non Permanent Redirect
        })
    },
})
