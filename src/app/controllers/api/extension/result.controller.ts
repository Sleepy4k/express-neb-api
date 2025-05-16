/* eslint-disable perfectionist/sort-objects */
import type { Request, Response } from "express";

import { parseHostname } from "@utils/parse.js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(fileURLToPath(import.meta.url), "../../../../../storage/app/seb/results");

/**
 * Result controller to send json response
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = async (req: Request, res: Response) => {
  const folderName = req.params.deviceKey;

  const files = await fs.readdir(path.join(__basedir, folderName));
  const fileList = files.map(async (file) => {
    const filePath = path.join(__basedir, folderName, file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return fileContent;
  });

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Success",
    data: {
      hostname: parseHostname(req.hostname),
      deviceKey: folderName,
      result: await Promise.all(fileList),
    },
  });
  return;
};

export { home };
