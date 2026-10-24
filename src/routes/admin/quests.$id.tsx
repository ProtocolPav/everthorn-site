import { createFileRoute, Outlet } from '@tanstack/react-router'

/**
 * Shell for the quest hub and its sub-pages (performance, player progress).
 * Each page owns its own masthead, so this only renders the matched child.
 */
export const Route = createFileRoute('/admin/quests/$id')({
    component: QuestHubLayout,
})

function QuestHubLayout() {
    return <Outlet />
}
