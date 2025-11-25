import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/support')({
    loader: () => {
        throw redirect({
            href: 'https://patreon.com/Everthorn',
            statusCode: 301, // Permanent
        })
    },
})
