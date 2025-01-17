import path from 'node:path';
import multer, { FileFilterCallback } from "multer";
import type { Request } from 'express';
import { fileURLToPath } from "node:url";
import type {
  DestinationCallback,
  FileNameCallback
} from '@interfaces/multerDiskStorage.js';

const __basedir = path.resolve(fileURLToPath(import.meta.url) + '/../../..');

const sebFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.originalname.match(/\.(seb)$/) &&
    file.mimetype === 'application/octet-stream'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    cb(null, path.join(__basedir, "storage/app"));
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    const { redeemCode } = req.params;

    if (!redeemCode) {
      cb(null, `bypass-${Date.now()}-${Math.floor(Math.random() * 10000)}-${file.originalname}`);
      return;
    }

    cb(null, `bypass-${redeemCode}-${Date.now()}-${Math.floor(Math.random() * 10000)}-${file.originalname}`);
  },
});

const fileUploader = multer({ storage: storage, fileFilter: sebFilter });

export default fileUploader;