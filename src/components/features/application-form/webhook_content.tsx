export default function webhook_content(values: any) {
    return JSON.stringify({
        content: "<@&864915135297617922> 🎮 **New Everthorn Application** 🎮\n" +
            "📋 Review the application below and send them a friend request if approved!\n" +
            "React with :saluting_face: when you've sent the friend request.\n\n" +
            "> **Referral Sources:** `friends`, `reddit`, `discord`, `website`, `youtube`, `other`",
        embeds: [
            {
                title: "🏰 New Application from Everthorn.net",
                color: 5763719,
                thumbnail: {
                    url: "https://via.placeholder.com/80x80.png?text=👤"
                },
                fields: [
                    {
                        name: "📊 General Information",
                        value: `> **Discord:** \`@${values.username}\`\n` +
                            `> **Age:** ||${values.age}||\n` +
                            `> **Timezone:** ${values.timezone}\n` +
                            `> **Experience:** ${values.experience || 'Not specified'}\n` +
                            `> **Activity Level:** ${values.activity || values.hours || 'Not specified'}\n` +
                            `> **How they found us:** \`${values.heard_from || 'other'}\``,
                        inline: false
                    },
                    {
                        name: "🎯 Playstyle & Interests",
                        value: `\`\`\`${values.playstyle || values.interests || 'Not provided'}\`\`\``,
                        inline: false
                    },

                    // Dynamic fields that only show if they exist
                    ...(values.building_experience ? [{
                        name: "🏗️ Building Experience",
                        value: `\`\`\`${values.building_experience.length > 800
                            ? values.building_experience.substring(0, 800) + "..."
                            : values.building_experience}\`\`\``,
                        inline: false
                    }] : []),

                    ...(values.redstone_experience ? [{
                        name: "⚡ Redstone Experience",
                        value: `\`\`\`${values.redstone_experience.length > 800
                            ? values.redstone_experience.substring(0, 800) + "..."
                            : values.redstone_experience}\`\`\``,
                        inline: false
                    }] : []),

                    ...(values.leadership_experience ? [{
                        name: "👑 Leadership Experience",
                        value: `\`\`\`${values.leadership_experience.length > 800
                            ? values.leadership_experience.substring(0, 800) + "..."
                            : values.leadership_experience}\`\`\``,
                        inline: false
                    }] : []),

                    {
                        name: "🤝 Community Values",
                        value: `\`\`\`${values.community_values || values.description || 'Not provided'}\`\`\``,
                        inline: false
                    },
                    {
                        name: "⚖️ Conflict Resolution",
                        value: `\`\`\`${values.conflict_resolution || 'Not provided'}\`\`\``,
                        inline: false
                    },

                    // Show referral details if they exist
                    ...(values.heard_from_details ? [{
                        name: "📍 Referral Details",
                        value: `> ${values.heard_from_details}`,
                        inline: false
                    }] : []),

                    {
                        name: "💬 Additional Information",
                        value: `\`\`\`${values.other || 'Nothing additional provided'}\`\`\``,
                        inline: false
                    }
                ],
                footer: {
                    text: `Application ID: ${Date.now()} • Submitted ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                    icon_url: "https://cdn.discordapp.com/emojis/123456789012345678.png"
                },
                timestamp: new Date().toISOString()
            }
        ]
    })
}