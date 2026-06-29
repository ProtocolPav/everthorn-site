import { createAuthClient } from "better-auth/react"
import {inferAdditionalFields} from "better-auth/client/plugins";
import {auth} from "@/lib/auth.ts";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BASE_URL,
    plugins: [inferAdditionalFields<typeof auth>()]
})

export const signIn = async () => {
    const currentPath = typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : '/';

    await authClient.signIn.social({
        provider: "discord",
        callbackURL: currentPath
    })
}

export const signOut = async () => {
    await authClient.signOut()
}