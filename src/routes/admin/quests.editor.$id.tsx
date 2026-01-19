import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/quests/editor/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/quests/$id"!</div>
}
