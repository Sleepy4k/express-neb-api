/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config/app.config.js";
import { discordConfig } from "@config/discord.config.js";
import { saweriaConfig } from "@config/saweria.config.js";
import { smtpConfig } from "@config/smtp.config.js";
import { telegramConfig } from "@config/telegram.config.js";
import { TOKEN_PRICING } from "@constants/pricing.js";
import { ISaweriaData } from "@interfaces/saweriaData.js";
import RedeemModel from "@models/redeem.model.js";
import Mail from "@modules/mail.js";
import { nameToRedeemCode, parseHostname } from "@utils/parse.js";
import axios from "axios";
import fs from "node:fs/promises";
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
  if (!req.headers["saweria-callback-signature"] || req.headers["saweria-callback-signature"] === "") {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Unauthorized request",
      data: {},
    });
    return;
  }

  if ((req.query.verificator ?? "") !== saweriaConfig.webhook.token) {
    res.status(401).json({
      code: 401,
      status: "error",
      message: "Unauthorized request",
      data: {},
    });
    return;
  }

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

  const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);
  const sortedPricing = TOKEN_PRICING.sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPricing[0]?.price;

  if (!lowestPrice || amount_raw < lowestPrice) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid amount_raw",
      data: {
        amount_raw: `amount_raw must be at least ${lowestPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`,
      },
    });

    if (!(req.app.get("isDevMode") as boolean)) {
      await new Mail()
        .sendMail({
          from: `NEB Payments <${smtpConfig.auth.user}>`,
          to: donator_email,
          subject: `${appConfig.name} - Payment Issue Notification`,
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                  <h2 style="color: #555;">Hello ${donator_name},</h2>
                  <p>Thank you for your generous support!</p>
                  <p>Unfortunately, we couldn't process your payment of <strong>${amount_raw.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</strong> because it doesn't meet the minimum pricing requirement.</p>
                  <p>Please visit our <a href="${baseUrl}/contact" target="_blank" rel="noopener" style="color: #007bff; text-decoration: none;">Contact Us</a> page for more information about our pricing tiers.</p>
                  <p>We truly appreciate your understanding and hope to assist you further.</p>
                  <p style="margin-top: 20px;">Best regards,</p>
                  <p style="font-weight: bold;">${appConfig.name} Team</p>
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  <footer style="text-align: center; font-size: 12px; color: #777;">
                    &copy; ${new Date().getFullYear().toString()} ${appConfig.name}. All Rights Reserved.
                  </footer>
                </div>
              </body>
            </html>
          `,
        })
        .catch((error: unknown) => {
          console.error("Error sending email:", error);
        });
    }
    return;
  }

  const tokenPricing = sortedPricing
    .slice()
    .reverse()
    .find((token) => amount_raw >= token.price);

  if (!tokenPricing) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid amount_raw",
      data: {
        amount_raw: "amount_raw must match a valid pricing tier",
      },
    });
    return;
  }

  const remainingBalance = amount_raw - tokenPricing.price;
  const tokensToGenerate = tokenPricing.token + Math.floor(remainingBalance / lowestPrice);
  const totalRedeemCode = await redeemModel.countByName(donator_email);

  const tokenList = await Promise.all(
    Array.from({ length: tokensToGenerate }, async (_, i) => {
      const randomizer = Math.floor(Math.random() * 10000).toString();
      const redeemCode = nameToRedeemCode(donator_email.split("@")[0], `${randomizer}-${(totalRedeemCode + i + 1).toString()}`);
      return redeemModel.create(
        redeemCode,
        donator_email,
        `Token dari ${donator_name} sebesar ${lowestPrice.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`,
      );
    }),
  );

  const placeholders: Record<string, string | string[]> = {
    APP_NAME: appConfig.name,
    CONTACT_URL: `${baseUrl}/contact`,
    DESCRIPTION: `${donator_name}<br>${donator_email}<br>${amount_raw.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}`,
    FOOTER: `@ ${new Date().getFullYear().toString()} ${appConfig.name}. All Rights Reserved.`,
    MESSAGE: `Thank you ${donator_name} for supporting us`,
    TOTAL_TOKEN: tokensToGenerate.toString(),
    TOKENS_FIELD: tokenList
      .map((token, index) => `<tr><td>Token ${(index + 1).toString()}</td><td class="alignright">${token.code}</td></tr>`)
      .join(""),
  };

  const paymentHtml = await fs
    .readFile(path.join(__basedir, "payment.html"), "utf8")
    .then((data: string) => {
      return data.replace(/{{ (.*?) }}/g, (_, key: string) => String(placeholders[key.trim()] || ""));
    })
    .catch((error: unknown) => {
      console.error("Error reading file:", error);
      return "";
    });

  const HEADERS = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  res.json({
    code: 200,
    status: "success",
    message: "Saweria Webhook Received",
    data: tokenList,
  });

  if (!(req.app.get("isDevMode") as boolean)) {
    await new Mail()
      .sendMail({
        from: `NEB Payments <${smtpConfig.auth.user}>`,
        to: donator_email,
        subject: `${appConfig.name} - Thank You for Your ${type}`,
        html: paymentHtml,
      })
      .catch((error: unknown) => {
        console.error("Error sending email:", error);
      });

    await axios
      .post(
        discordConfig.webhook.url,
        {
          username: discordConfig.webhook.name,
          avatar_url: discordConfig.webhook.avatar_url,
          embeds: [
            {
              title: `${donator_name} mengirimkan sebuah ${type}`,
              description: `
                Email: ${donator_email}
                Jumlah: ${String(amount_raw)}
                Pesan: ${message}

                <@460453000129937408>
                <@602069520709976064>
                <@998089787024093264>
              `,
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
      .catch((error: unknown) => {
        console.error("Error sending message to Discord webhook:", error);
      });

    await axios
      .post(
        telegramConfig.endpoint.replace("<YOUR_BOT_TOKEN>", telegramConfig.token).replace("<YOUR_CHAT_ID>", telegramConfig.token),
        {
          chat_id: telegramConfig.chat_id,
          text: `${donator_name} mengirimkan sebuah ${type} dengan jumlah ${String(amount_raw)} dan pesan "${message}\n**Pesan Ini Dikirim Dari NEB Service**`,
        },
        HEADERS,
      )
      .catch((error: unknown) => {
        console.error("Error sending message to Telegram:", error);
      });
  }
};

export default handler;
