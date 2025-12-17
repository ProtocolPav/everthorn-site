import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className="border border-primary h-full rounded-lg p-3 m-3">
          adsadsa
          dsa
          <div className="border border-primary h-400 rounded-lg p-3 m-3">
              adsadsa
              dsa
          </div>
      </div>
  )
}
