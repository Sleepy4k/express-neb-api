/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { appConfig } from "@config/app.config.js";
import { smtpConfig } from "@config/smtp.config.js";
import { ContactSubject, ContactSubjectList } from "@enums/contactSubject.js";
import { type IContactFormBody } from "@interfaces/contactFormBody.js";
import ContactModel from "@models/contact.model.js";
import Mail from "@modules/mail.js";
import { parseHostname } from "@utils/parse.js";

/**
 * The contact model instance for the contact controller
 *
 * @type {ContactModel}
 */
const contactModel: ContactModel = new ContactModel();

/**
 * The home function to render the contact page
 *
 * @param {Request} _req - The request
 * @param {Response} res - The response
 */
const home = (_req: Request, res: Response) => {
  res.render("pages/landing/contact", {
    subjects: ContactSubjectList,
  });
};

/**
 * The process controller for the contact controller
 *
 * @param {Request} req - The request
 * @param {Response} res - The response
 */
const process = async (req: Request<object, object, IContactFormBody>, res: Response) => {
  const { email, message, name, subject } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({
      data: [],
      message: "All fields are required",
      status: "error",
    });
    return;
  }

  if (!Object.values(ContactSubject).includes(subject as ContactSubject)) {
    res.status(400).json({
      data: [],
      message: `Subject must be one of the following: ${Object.values(ContactSubject).join(", ")}`,
      status: "error",
    });
    return;
  }

  try {
    const file = req.file;
    const filePath = file ? `${subject}/${file.filename}` : "";
    await contactModel.create(name, email, subject as ContactSubject, message, filePath);

    res.status(200).json({
      data: [],
      message: "Your message has been sent successfully",
      status: "success",
    });

    if (!(req.app.get("isDevMode") as boolean)) {
      const baseUrl = parseHostname(`${req.protocol}://${req.get("host") ?? ""}`);
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
        await new Mail()
          .sendMail({
            from: `NEB Contact Form <${smtpConfig.auth.user}>`,
            to: "happytime6318@gmail.com",
            subject: `${appConfig.name} - New Contact Form Submission`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1E90FF;">${email}</a></p>
              <p><strong>Message:</strong></p>
              <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555;">${message}</blockquote>
              <p><strong>File:</strong> ${
                filePath
                  ? `<a href="${new URL(`/storage/contact/${filePath}`, baseUrl).toString()}" style="color: #1E90FF;">Download File</a>`
                  : "No file attached"
              }</p>
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
    console.log(error);

    res.status(500).json({
      data: [],
      message: "An error occurred",
      status: "error",
    });
  }
};

export { home, process };
