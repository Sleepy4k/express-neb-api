import type { DestinationCallback, FileNameCallback, MulterFile } from "@interfaces/multerDiskStorage.js";

import FILE_EXTENSIONS from "@constants/file-extensions.js";
import { type Request } from "express";
import multer, { type FileFilterCallback } from "multer";
import fs from "node:fs";
import path from "node:path";

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
  destination: (req: Request, _file: MulterFile, cb: DestinationCallback): void => {
    const __basedir = req.app.get("basePath") as string;
    const filePath = path.join(__basedir, "storage/app/seb/config");

    if (!fs.existsSync(filePath)) {
      fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) console.error("Error creating directory:", err);
      });
    }

    cb(null, filePath);
  },
  filename: (_req: Request, file: MulterFile, cb: FileNameCallback): void => {
    const uniqueSuffix = Math.floor(Math.random() * 10000).toString();
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const fileName = file.originalname.replaceAll(/\s+/g, "-");

    cb(null, `bypass-${uniqueSuffix}-${currentDate}-${fileName}`);
  },
});

/**
 * SEB File uploader middleware
 */
const sebFileUploader = multer({ fileFilter: sebFilter, storage: sebDiskStorage });

export { sebFileUploader };
