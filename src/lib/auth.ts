import { betterAuth } from "better-auth";
import {tanstackStartCookies} from "better-auth/tanstack-start";
import {createAuthMiddleware} from "better-auth/api";

export const auth = betterAuth({
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/discord`,
            scope: ["identify", "email", "guilds"],
            mapProfileToUser: ((profile) => {
                return {
                    discord_id: profile.id,
                    guildNames: []
                }
            })
        },
    },

    account: {
        storeAccountCookie: true
    },

    session: {
        updateAge: 60 * 60 * 24, // 1 day
        expiresIn: 60 * 60 * 24 * 7, // 7 days
    },

    user: {
        additionalFields: {
            discord_id: {type: "string"},
            guildNames: {type: "string[]"},
        }
    },

    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            const { session } = ctx.context;

            if (session) {
                session.user.name = "TESTT"

                const cookie = ctx.getCookie(ctx.context.authCookies.accountData.name)

                if (!cookie) return;

                const parsed_cookie = JSON.parse(cookie.slice(0, cookie.indexOf('}') + 1))

                try {
                    // Fetch the user's guilds from Discord
                    const res = await fetch("https://discord.com/api/users/@me/guilds", {
                        headers: {
                            Authorization: `Bearer ${parsed_cookie.accessToken}`,
                        },
                    });
                    const guilds = await res.json();  // Add guild names to session.user

                    session.user.guildNames = guilds.map((g: any) => g.name);  }

                catch (err) {
                    console.error("Failed to fetch Discord guilds:", err);
                    session.user.guildNames = [];
                }
            }
        }),
    },

    plugins: [tanstackStartCookies()] // make sure this is the last plugin in the array
})