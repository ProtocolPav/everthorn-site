import { betterAuth } from "better-auth";
import {tanstackStartCookies} from "better-auth/tanstack-start";
import {Pool} from "pg";

export const auth = betterAuth({
    database: new Pool({
        host: "localhost",
        port: 5432,
        user: "thorny",
        password: "postgrespw",
        database: "thorny",
        options: "-c search_path=auth",
    }),

    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/discord`,
            mapProfileToUser: ((profile) => {
                return {
                    discord_id: `${profile.id}`,
                    nick: profile.display_name ?? profile.global_name ?? profile.username,
                    banner: profile.banner,
                    banner_color: profile.banner_color,
                    decoration: profile.avatar_decoration_data
                }
            })
        },
    },

    user: {
        additionalFields: {
            discord_id: {type: "string"},
            nick: {type: "string", required: false},
            banner: {type: "string", required: false},
            banner_color: {type: "string", required: false},
            decoration: {type: "string", required: false},
        }
    },

    plugins: [tanstackStartCookies()] // make sure this is the last plugin in the array
})