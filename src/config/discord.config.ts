/* eslint-disable perfectionist/sort-objects */
import dotenv from "dotenv";

dotenv.config();

export const discordConfig = {
  webhook: {
    url: process.env.DISCORD_WEBHOOK_URL ?? "",
    name: process.env.DISCORD_WEBHOOK_NAME ?? "",
    avatar_url: process.env.DISCORD_WEBHOOK_AVATAR_URL ?? "",
    color: process.env.DISCORD_WEBHOOK_COLOR ?? "",
    embed: {
      footer: {
        text: process.env.DISCORD_WEBHOOK_EMBED_FOOTER_TEXT ?? "",
        icon_url: process.env.DISCORD_WEBHOOK_EMBED_FOOTER_ICON_URL ?? "",
      },
    },
  },
};
