import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HandWavingIcon } from '@phosphor-icons/react'

export const Route = createFileRoute('/admin/')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="h-full flex flex-col p-6">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <HandWavingIcon className="h-6 w-6 text-yellow-500" weight="fill" />
                        Hi, User
                    </CardTitle>
                    <CardDescription>
                        Welcome to your admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Select an option from the sidebar to get started.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
