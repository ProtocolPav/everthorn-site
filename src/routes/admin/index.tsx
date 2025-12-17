import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className="border border-primary h-full">
          adsadsa
          dsa
      </div>
  )
}
