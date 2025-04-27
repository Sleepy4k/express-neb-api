import type { Request, Response } from "express";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get path to the root directory using dot-to-parent
 *
 * @note If file path is changed, this should be updated
 */
const dotToParent = "/../../../../..";

/**
 * Get the current file path
 */
const currPath = fileURLToPath(import.meta.url);

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(currPath + dotToParent);

/**
 * The home function to render the tutorial page
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = (req: Request, res: Response) => {
  const filePath = req.params.filePath;
  if (!filePath || filePath.length !== 2) {
    res.status(400).json({
      data: [],
      message: "File path is required",
      status: "error",
    });
    return;
  }

  const fileFullPath = path.join(__basedir, `storage/app/contact/${filePath[0]}/${filePath[1]}`);
  fs.readFile(fileFullPath, (err, data) => {
    if (err) {
      res.status(500).json({
        data: [],
        message: "File not found",
        status: "error",
      });
      return;
    }

    const fileExtention = filePath[1].split(".").pop() ?? "png";

    // show the file content as binary
    // res.contentType("image/png");
    // res.send(data);
    res.writeHead(200, {
      "Content-Type": fileExtention !== "pdf" ? `image/${fileExtention}` : "application/octet-stream",
      "Content-Disposition": `inline; attachment; filename=${filePath[1]}`,
    });
    res.end(data);
  });
};

export { home };
