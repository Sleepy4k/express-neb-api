/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config/app.config.js";
import Mail from "@modules/mail.js";
import { smtpConfig } from "@root/config/smtp.config.js";

/**
 * Interface for contact form body
 */
interface ContactFormBody {
  email: string;
  message: string;
  name: string;
}

const ContactController = {
  /**
   * Contact controller to send json response
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req: Request<object, object, ContactFormBody>, res: Response) {
    const { email, message, name } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "Please provide name, email and message!",
        errors: {
          name: !name ? "Name is required" : undefined,
          email: !email ? "Email is required" : undefined,
          message: !message ? "Message is required" : undefined,
        },
      });
      return;
    }

    try {
      res.status(200).json({
        code: 200,
        status: "success",
        message: "Your message has been sent successfully!",
        data: [],
      });

      if (!(req.app.get("isDevMode") as boolean)) {
        const mailType = appConfig.mail.toLowerCase();

        if (mailType === "web3form") {
          await new Mail()
            .sendMail({
              name,
              email,
              message: `${name} mengirimkan sebuah pesan "${message}"`,
            })
            .catch((error: unknown) => {
              console.error("Error sending email using Web3Form:", error);
            });
        } else {
          const userMail = smtpConfig.auth?.user ?? "";

          await new Mail()
            .sendMail({
              from: `NEB Contact Form <${userMail}>`,
              to: "happytime6318@gmail.com",
              subject: `${appConfig.name} - New Contact Form Submission`,
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1E90FF;">${email}</a></p>
                  <p><strong>Message:</strong></p>
                  <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555;">${message}</blockquote>
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  <p style="font-size: 0.9em; color: #777;">This email was sent from the NEB Contact Form.</p>
                </div>
              `,
            })
            .catch((error: unknown) => {
              console.error("Error sending email:", error);
            });
        }
      }
    } catch (error) {
      console.error(error);

      res.status(500).json({
        code: 500,
        status: "error",
        message: "An error occurred while sending your message. Please try again later.",
        errors: {
          server: "Internal Server Error",
        },
      });
    }
  },
};

export default ContactController;
