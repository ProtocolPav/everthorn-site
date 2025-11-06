import { createFileRoute } from '@tanstack/react-router'
import {Button} from "@/components/ui/button.tsx";

export const Route = createFileRoute('/shadcn')({
  component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <Button>Click me</Button>
        </div>
    )
}
