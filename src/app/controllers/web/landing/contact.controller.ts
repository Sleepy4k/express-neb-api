import type { Request, Response } from "express";

import { web3formConfig } from "@config/web3form.config.js";
import { ContactSubject, ContactSubjectList } from "@enums/contactSubject.js";
import { type IContactFormBody } from "@interfaces/contactFormBody.js";
import ContactModel from "@models/contact.model.js";
import axios from "axios";

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

    if (!(req.app.get("isDevMode") as boolean)) {
      await axios
        .post(
          web3formConfig.form_url,
          {
            access_key: web3formConfig.access_key,
            email,
            message: `${name} mengirimkan sebuah pesan "${message}"`,
            name,
          },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          },
        )
        .catch((error: unknown) => {
          console.error("Error sending message to Discord webhook:", error);
        });
    }

    res.status(200).json({
      data: [],
      message: "Your message has been sent successfully",
      status: "success",
    });
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
