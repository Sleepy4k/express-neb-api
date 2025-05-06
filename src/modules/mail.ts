/* eslint-disable perfectionist/sort-interfaces */
import type { SentMessageInfo, Transporter } from "nodemailer";
import type { Options } from "nodemailer/lib/smtp-transport/index.js";

import { appConfig } from "@config/app.config.js";
import { smtpConfig } from "@config/smtp.config.js";
import { web3formConfig } from "@config/web3form.config.js";
import axios from "axios";
import { createTransport } from "nodemailer";

interface ISMTPData {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface IWeb3formData {
  name: string;
  email: string;
  message: string;
}

class Mail {
  /**
   * Transporter instance for sending emails
   * @type {Transporter<SentMessageInfo, Options>}
   */
  #transporter: Transporter<SentMessageInfo, Options>;

  /**
   * Constructor for the Mail class
   * Initializes the transporter instance using SMTP configuration
   */
  public constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.#transporter = createTransport(smtpConfig as Options);
  }

  /**
   * Sends an email or a Discord message based on the configuration
   *
   * @param {ISMTPData | IWeb3formData} body - The data to be sent
   *
   * @returns {Promise<void>}
   */
  public async sendMail(body: ISMTPData | IWeb3formData): Promise<void> {
    const mailType = appConfig.mail.toLowerCase();

    switch (mailType) {
      case "smtp":
        await this.sendSMTPMail(body as ISMTPData);
        break;
      case "web3form":
        await this.sendWeb3formMail(body as IWeb3formData);
        break;
      default:
        console.warn(`Unknown mail type "${mailType}", defaulting to SMTP.`);
        await this.sendSMTPMail(body as ISMTPData);
        break;
    }
  }

  /**
   * Sends an email using SMTP configuration
   *
   * @param {ISMTPData} body - The email data to be sent
   *
   * @returns {Promise<void>}
   */
  private async sendSMTPMail(body: ISMTPData): Promise<void> {
    if (!this.#transporter) {
      console.error("Transporter is not ready");
      return;
    }

    try {
      const mailOptions: ISMTPData = {
        from: body.from ?? smtpConfig.auth.user,
        subject: body.subject,
        to: body.to,
      };

      if (body.text) {
        mailOptions.text = body.text;
      }

      if (body.html) {
        mailOptions.html = body.html;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await this.#transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  /**
   * Sends a message to a Discord webhook using Web3form configuration
   *
   * @param {IWeb3formData} body - The message data to be sent
   *
   * @returns {Promise<void>}
   */
  private async sendWeb3formMail(body: IWeb3formData): Promise<void> {
    try {
      await axios.post(
        web3formConfig.form_url,
        {
          access_key: web3formConfig.access_key,
          email: body.email,
          message: body.message,
          name: body.name,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error: unknown) {
      console.error("Error sending message to Discord webhook:", error);
    }
  }
}

export default Mail;
