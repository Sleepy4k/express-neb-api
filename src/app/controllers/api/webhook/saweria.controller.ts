/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config/app.config.js";
import { discordConfig } from "@config/discord.config.js";
import { smtpConfig } from "@config/smtp.config.js";
import { telegramConfig } from "@config/telegram.config.js";
import { TOKEN_PRICING } from "@constants/pricing.js";
import { RedeemData } from "@interfaces/redeemData.js";
import { ISaweriaData } from "@interfaces/saweriaData.js";
import RedeemModel from "@models/redeem.model.js";
import Mail from "@modules/mail.js";
import { nameToRedeemCode, parseHostname } from "@utils/parse.js";
import axios from "axios";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(fileURLToPath(import.meta.url), "../../../../../storage/app/mail");

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {RedeemModel}
 */
const redeemModel: RedeemModel = new RedeemModel();

/**
 * Saweria controller to handle the webhook request
 *
 * @param {Request} req
 * @param {Response} res
 */
const handler = async (req: Request<object, object, ISaweriaData>, res: Response) => {
  const { type, message, amount_raw, donator_name, donator_email } = req.body;

  if (!type || !message || !amount_raw || !donator_name || !donator_email) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid request",
      data: {
        type: !type ? "type is required" : undefined,
        message: !message ? "message is required" : undefined,
        amount_raw: !amount_raw ? "amount_raw is required" : undefined,
        donator_name: !donator_name ? "donator_name is required" : undefined,
        donator_email: !donator_email ? "donator_email is required" : undefined,
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

  const tokenPricing = TOKEN_PRICING.find((token) => token.price === amount_raw);
  if (!tokenPricing) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid amount_raw",
      data: {
        amount_raw: "amount_raw must be one of the following: " + TOKEN_PRICING.map((token) => token.price).join(", "),
      },
    });
    return;
  }

  const tokenList: RedeemData[] = [];
  const totalRedeemCode = (await redeemModel.countByName(donator_email)) + 1;

  for (let i = totalRedeemCode; i < totalRedeemCode + tokenPricing.token; i++) {
    const randomizer = Math.floor(Math.random() * 10000).toString();
    const redeemCode = nameToRedeemCode(donator_email.split("@")[0], `${randomizer}-${i.toString()}`);
    const token = await redeemModel.create(redeemCode, donator_email, `Token dari ${donator_name} sebesar ${String(amount_raw)}`);
    tokenList.push(token);
  }

  let paymentHtml = await new Promise<string>((resolve, reject) => {
    fs.readFile(path.join(__basedir, "payment.html"), "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  const replaceableStrings = paymentHtml.match(/{{ (.*?) }}/g);
  if (replaceableStrings) {
    replaceableStrings.forEach((replaceableString) => {
      const key = replaceableString.replace(/{{ | }}/g, "").trim();
      let value: string | string[] = "";

      switch (key) {
        case "APP_NAME":
          value = appConfig.name;
          break;
        case "CONTACT_URL":
          value = `${parseHostname(`${req.protocol}://${req.get("host") ?? ""}`)}/contact`;
          break;
        case "DESCRIPTION":
          value = `${donator_name}<br>${donator_email}<br>${String(amount_raw)}`;
          break;
        case "FOOTER":
          value = `@ ${new Date().getFullYear().toString()} ${appConfig.name}. All Rights Reserved.`;
          break;
        case "MESSAGE":
          value = `Thank you ${donator_name} for supporting us`;
          break;
        case "TOKENS_FIELD":
          value = tokenList
            .map((token, index) => `<tr><td>Token ${(index + 1).toString()}</td><td class="alignright">${token.code}</td></tr>`)
            .join("");
          break;
        case "TOTAL_TOKEN":
          value = tokenList.length.toString();
          break;
        default:
          break;
      }

      paymentHtml = paymentHtml.replace(replaceableString, value);
    });
  }

  const HEADERS = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  if (!(req.app.get("isDevMode") as boolean)) {
    try {
      await new Mail().sendMail({
        from: `NEB Payments <${smtpConfig.auth.user}>`,
        to: donator_email,
        subject: `${appConfig.name} - Your ${type} has been received`,
        html: paymentHtml,
      });
    } catch (error: unknown) {
      console.error(`Error sending email using smtp:`, error);
    }

    try {
      await axios.post(
        discordConfig.webhook.url,
        {
          username: discordConfig.webhook.name,
          avatar_url: discordConfig.webhook.avatar_url,
          embeds: [
            {
              title: `${donator_name} mengirimkan sebuah ${type}`,
              description: `Email: ${donator_email}
        Jumlah: ${String(amount_raw)}
        Pesan: ${message}

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
      );
    } catch (error: unknown) {
      console.error("Error sending message to Discord webhook:", error);
    }

    try {
      await axios.post(
        telegramConfig.endpoint.replace("<YOUR_BOT_TOKEN>", telegramConfig.token).replace("<YOUR_CHAT_ID>", telegramConfig.token),
        {
          chat_id: telegramConfig.chat_id,
          text: `${donator_name} mengirimkan sebuah ${type} dengan jumlah ${String(amount_raw)} dan pesan "${message}\n**Pesan Ini Dikirim Dari NEB Service**`,
        },
        HEADERS,
      );
    } catch (error: unknown) {
      console.error("Error sending message to Discord webhook:", error);
    }
  }

  res.json({
    code: 200,
    status: "success",
    message: "Saweria Webhook Received",
    data: {},
  });
};

export default handler;
