import type { DestinationCallback, FileNameCallback, MulterFile } from "@interfaces/multerDiskStorage.js";

import FILE_EXTENSIONS from "@constants/file-extensions.js";
import { ContactSubject } from "@enums/contactSubject.js";
import { IContactFormBody } from "@interfaces/contactFormBody.js";
import { type Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get path to the root directory using dot-to-parent
 *
 * @note If file path is changed, this should be updated
 */
const dotToParent = "/../../..";

/**
 * Get the current file path
 */
const currPath = fileURLToPath(import.meta.url);

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(currPath + dotToParent);

/**
 * Filter SEB files only
 *
 * @param {Request} _req
 * @param {Express.Multer.File} file
 * @param {FileFilterCallback} cb
 *
 * @returns {void}
 */
const sebFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback): void => {
  const { mimetype, originalname } = file;
  const fileExtension = originalname.split(".").pop() ?? "";
  const isExtensionValid = FILE_EXTENSIONS.seb.extensions.includes(`.${fileExtension}`);
  const isMimeTypeValid = FILE_EXTENSIONS.seb.mimeTypes.includes(mimetype);

  cb(null, isExtensionValid && isMimeTypeValid);
};

/**
 * Setup the storage for the seb file
 */
const sebDiskStorage = multer.diskStorage({
  destination: (_req: Request, _file: MulterFile, cb: DestinationCallback): void => {
    const filePath = path.join(__basedir, "storage/app/seb/config");

    if (!fs.existsSync(filePath)) {
      fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) console.error("Error creating directory:", err);
      });
    }

    cb(null, filePath);
  },
  filename: (req: Request, file: MulterFile, cb: FileNameCallback): void => {
    const { redeemCode } = req.params;
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString();
    const prefixName = redeemCode ? `bypass-${redeemCode}` : "bypass";
    const fileName = file.originalname.replaceAll(/\s+/g, "-");

    cb(null, `${prefixName}-${uniqueSuffix}-${fileName}`);
  },
});

/**
 * Filter Image and PDF files only
 *
 * @param {Request} _req
 * @param {Express.Multer.File} file
 * @param {FileFilterCallback} cb
 *
 * @returns {void}
 */
const contactFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback): void => {
  const { mimetype, originalname } = file;
  const fileExtension = originalname.split(".").pop() ?? "";
  const isExtensionValid = FILE_EXTENSIONS.contact.extensions.includes(`.${fileExtension}`);
  const isMimeTypeValid = FILE_EXTENSIONS.contact.mimeTypes.includes(mimetype);

  cb(null, isExtensionValid && isMimeTypeValid);
};

/**
 * Setup the storage for the contact file
 */
const contactDiskStorage = multer.diskStorage({
  destination: (req: Request<object, object, IContactFormBody>, _file: MulterFile, cb: DestinationCallback): void => {
    const { subject } = req.body;
    const filePath = path.join(
      __basedir,
      "storage/app/contact",
      Object.values(ContactSubject).includes(subject as ContactSubject) ? subject : "general",
    );

    if (!fs.existsSync(filePath)) {
      fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) console.error("Error creating directory:", err);
      });
    }

    cb(null, filePath);
  },
  filename: (_req: Request, file: MulterFile, cb: FileNameCallback): void => {
    const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = file.originalname.replaceAll(/\s+/g, "-");

    cb(null, `${uniqueSuffix}-${sanitizedFileName}`);
  },
});

/**
 * SEB File uploader middleware
 */
const sebFileUploader = multer({ fileFilter: sebFilter, storage: sebDiskStorage });

/**
 * Contact File uploader middleware
 */
const contactFileUploader = multer({ fileFilter: contactFilter, storage: contactDiskStorage });

export { contactFileUploader, sebFileUploader };
