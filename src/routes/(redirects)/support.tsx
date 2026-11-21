import {createFileRoute, redirect} from '@tanstack/react-router'

export const Route = createFileRoute('/(redirects)/support')({
    loader: () => {
        throw redirect({
            href: 'https://ko-fi.com/Everthorn',
            statusCode: 302, // Non Permanent Redirect
        })
    },
})
