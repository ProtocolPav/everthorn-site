import { createFileRoute } from '@tanstack/react-router'
import {RouteComponent} from "@/routes/_main/musings.$.tsx";

export const Route = createFileRoute('/_main/musings/')({
    component: RouteComponent,
})