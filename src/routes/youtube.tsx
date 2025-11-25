import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/youtube')({
    loader: () => {
        throw redirect({
            href: 'https://www.youtube.com/@EverthornMC',
            statusCode: 301, // Permanent
        })
    },
})
