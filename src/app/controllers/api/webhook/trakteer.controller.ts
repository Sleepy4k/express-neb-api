/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { discordConfig } from "@config/discord.config.js";
import { trakteerConfig } from "@config/trakteer.config.js";
import { web3formConfig } from "@config/web3form.config.js";
import { ITrakteerData } from "@interfaces/trakteerData.js";
import axios from "axios";

/**
 * Trakteer controller to handle the webhook request
 *
 * @param {Request} req
 * @param {Response} res
 */
const handler = (req: Request<object, object, ITrakteerData>, res: Response) => {
  const { type, supporter_name, supporter_message, price } = req.body;

  if (req.headers["x-webhook-token"] !== trakteerConfig.webhook.token) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {},
    });
    return;
  }

  if (!type || !supporter_name || !supporter_message || !price) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid request",
      data: {
        type: !type ? "type is required" : undefined,
        supporter_name: !supporter_name ? "supporter_name is required" : undefined,
        supporter_message: !supporter_message ? "supporter_message is required" : undefined,
        price: !price ? "price is required" : undefined,
      },
    });
    return;
  }

  if (type !== "donation" && type !== "subscription" && type !== "tip") {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid type",
      data: {
        type: "type must be donation, subscription, or tip",
      },
    });
    return;
  }

  const HEADERS = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (!(req.app.get("isDevMode") as boolean)) {
    axios
      .post(
        discordConfig.webhook.url,
        {
          username: discordConfig.webhook.name,
          avatar_url: discordConfig.webhook.avatar_url,
          embeds: [
            {
              title: `${supporter_name} mengirimkan sebuah ${type}`,
              description: `Jumlah: ${String(price)}
        Pesan: ${supporter_message}

        <@460453000129937408>
        <@602069520709976064>
        <@998089787024093264>`,
              color: discordConfig.webhook.color,
              footer: {
                text: discordConfig.webhook.embed.footer.text,
                icon_url: discordConfig.webhook.embed.footer.icon_url,
              },
            },
          ],
        },
        HEADERS,
      )
      .then(async () => {
        await axios.post(
          web3formConfig.form_url,
          {
            access_key: web3formConfig.access_key,
            name: supporter_name,
            email: "trakteer@nach-neb.my.id",
            message: `${supporter_name} mengirimkan sebuah ${type} dengan jumlah ${String(price)} dan pesan "${supporter_message}"`,
          },
          HEADERS,
        );
      })
      .catch((error: unknown) => {
        console.error("Error sending message to Discord webhook:", error);
      });
  }

  res.json({
    code: 200,
    status: "success",
    message: "Trakteer Webhook Received",
    data: {},
  });
};

export default handler;
