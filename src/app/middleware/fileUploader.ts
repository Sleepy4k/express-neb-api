import type { DestinationCallback, FileNameCallback, MulterFile } from "@interfaces/multerDiskStorage.js";
import type { Request } from "express";

import { appConfig } from "@/config/app.config.js";
import multer, { FileFilterCallback } from "multer";
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
  const isSEB = originalname.endsWith(".seb");
  const isOctetStream = mimetype === "application/octet-stream";

  cb(null, isSEB && isOctetStream);
};

/**
 * Setup the storage for the file
 */
const diskStorage = multer.diskStorage({
  destination: (_req: Request, _file: MulterFile, cb: DestinationCallback): void => {
    let pathToStorage: string;

    if (appConfig.vercelMode) {
      pathToStorage = "/tmp";
    } else {
      pathToStorage = path.join(__basedir, "storage/app");
    }

    cb(null, pathToStorage);
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
 * File uploader middleware
 */
const fileUploader = multer({ fileFilter: sebFilter, storage: diskStorage });

export default fileUploader;
