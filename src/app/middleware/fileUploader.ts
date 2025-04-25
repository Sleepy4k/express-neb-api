import type { DestinationCallback, FileNameCallback, MulterFile } from "@interfaces/multerDiskStorage.js";

import FILE_EXTENSIONS from "@constants/file-extensions.js";
import { type Request } from "express";
import multer, { type FileFilterCallback } from "multer";
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
    cb(null, path.join(__basedir, "storage/app/service"));
  },
  filename: (req: Request, file: MulterFile, cb: FileNameCallback): void => {
    const { redeemCode } = req.params;
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString();
    const prefixName = redeemCode ? `bypass-${redeemCode}` : "bypass";
    const fileName = file.originalname.replaceAll(" ", "-");

    cb(null, `${prefixName}-${uniqueSuffix}-${fileName}`);
  },
});

/**
 * Filter Payment files only
 *
 * @param {Request} _req
 * @param {Express.Multer.File} file
 * @param {FileFilterCallback} cb
 *
 * @returns {void}
 */
const paymentFilter = (_req: Request, file: MulterFile, cb: FileFilterCallback): void => {
  const { mimetype, originalname } = file;
  const fileExtension = originalname.split(".").pop() ?? "";
  const isExtensionValid = FILE_EXTENSIONS.payment.extensions.includes(`.${fileExtension}`);
  const isMimeTypeValid = FILE_EXTENSIONS.payment.mimeTypes.includes(mimetype);

  cb(null, isExtensionValid && isMimeTypeValid);
};

/**
 * Setup the storage for the payment file
 */
const paymentDiskStorage = multer.diskStorage({
  destination: (_req: Request, _file: MulterFile, cb: DestinationCallback): void => {
    cb(null, path.join(__basedir, "storage/app/payment"));
  },
  filename: (req: Request, file: MulterFile, cb: FileNameCallback): void => {
    const { redeemCode } = req.params;
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString();
    const prefixName = redeemCode ? `seb-${redeemCode}` : "seb";
    const fileName = file.originalname.replaceAll(" ", "-");

    cb(null, `${prefixName}-${uniqueSuffix}-${fileName}`);
  },
});

/**
 * SEB File uploader middleware
 */
const sebFileUploader = multer({ fileFilter: sebFilter, storage: sebDiskStorage });

/**
 * Payment File uploader middleware
 */
const paymentFileUploader = multer({ fileFilter: paymentFilter, storage: paymentDiskStorage });

export {
  paymentFileUploader,
  sebFileUploader
};
