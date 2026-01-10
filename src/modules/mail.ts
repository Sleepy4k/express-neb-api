/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable perfectionist/sort-interfaces */
import type { Transporter } from "nodemailer";

import { appConfig } from "@config/app.config.js";
import { web3formConfig } from "@config/web3form.config.js";
import { smtpConfig } from "@root/config/smtp.config.js";
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
  private transporter: Transporter;

  /**
   * Constructor for the Mail class
   * Initializes the transporter instance using SMTP configuration
   */
  public constructor() {
    this.transporter = createTransport(smtpConfig);
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
    try {
      const userMail = smtpConfig.auth?.user ?? "";

      const mailOptions: ISMTPData = {
        from: body.from ?? userMail,
        subject: body.subject,
        to: body.to,
      };

      if (body.text) {
        mailOptions.text = body.text;
      }

      if (body.html) {
        mailOptions.html = body.html;
      }

      await this.transporter.sendMail(mailOptions);
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
