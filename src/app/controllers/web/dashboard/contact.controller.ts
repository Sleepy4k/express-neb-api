/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { ContactSubject } from "@enums/contactSubject.js";
import { RoleType } from "@enums/roleType.js";
import ContactModel from "@models/contact.model.js";
import { type ParamsDictionary } from "express-serve-static-core";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The interface for the request parameters
 * @interface IContactDeleteParams
 * @extends ParamsDictionary
 */
interface IContactDeleteParams extends ParamsDictionary {
  id: string;
  type: string;
}

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(fileURLToPath(import.meta.url), "../../../../../storage/app/contact");

/**
 * The redeem model instance for the dashboard controller
 *
 * @type {RedeemModel}
 */
const contactModel: ContactModel = new ContactModel();

/**
 * Contact controller to render the home page
 *
 * @param {Request} _req
 * @param {Response} res
 */
const home = async (_req: Request, res: Response) => {
  const contacts = await contactModel.get();
  const subjectCounts = Object.values(ContactSubject).reduce<Record<string, number>>((acc, subject) => {
    acc[subject] = contacts.filter((contact) => contact.subject === subject).length;
    return acc;
  }, {});

  const subjects = Object.entries(subjectCounts).map(([subject, count]) => ({
    subject,
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    count,
  }));

  res.render("pages/dashboard/contact/index", {
    subjects,
  });
};

/**
 * Contact controller to render the detail page
 *
 * @param {Request} req
 * @param {Response} res
 */
const show = async (req: Request, res: Response) => {
  const subjectType = req.params.type;

  if (!Object.values(ContactSubject).includes(subjectType as ContactSubject)) {
    res.render("pages/error", {
      message: "An error occurred!",
      status: `Subject must be one of the following: ${Object.values(ContactSubject).join(", ")}`,
    });
    return;
  }

  const user = req.session.user;
  const isUserNotAdmin = user?.role !== RoleType.ADMIN;

  const contacts = await contactModel.get();
  const filteredContacts = contacts.filter((contact) => contact.subject === (subjectType as ContactSubject));

  res.render("pages/dashboard/contact/show", {
    contacts: filteredContacts,
    canDeleteContact: !isUserNotAdmin,
  });
};

/**
 * Contact controller to handle delete contact
 *
 * @param {Request} req
 * @param {Response} res
 */
const remove = async (req: Request<IContactDeleteParams, object, object>, res: Response) => {
  const { id, type } = req.params;

  if (!id || !type) {
    res.status(400).json({
      data: [],
      message: "Contact ID and type are required",
      status: "error",
    });
    return;
  }

  if (!Object.values(ContactSubject).includes(type as ContactSubject)) {
    res.status(400).json({
      data: [],
      message: `Subject must be one of the following: ${Object.values(ContactSubject).join(", ")}`,
      status: "error",
    });
    return;
  }

  const oldData = await contactModel.find(id);
  const result = await contactModel.delete(id);

  if (!result) {
    res.status(500).json({
      data: [],
      message: "Failed to delete contact",
      status: "error",
    });
    return;
  }

  if (oldData?.file_url && oldData.file_url !== "") {
    const filePath = path.join(__basedir, oldData.file_url);

    await fs.unlink(filePath).catch((error: unknown) => {
      console.error("Error deleting file:", error);
    });
  }

  res.status(200).json({
    data: [],
    message: "Contact deleted successfully",
    status: "success",
  });
};

export { home, remove, show };
