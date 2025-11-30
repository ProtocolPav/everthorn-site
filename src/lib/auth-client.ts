import { createAuthClient } from "better-auth/react"
import {inferAdditionalFields} from "better-auth/client/plugins";
import {auth} from "@/lib/auth.ts";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [inferAdditionalFields<typeof auth>()]
})

export const signIn = async () => {
    await authClient.signIn.social({
        provider: "discord"
    })
}

export const signOut = async () => {
    await authClient.signOut()
}