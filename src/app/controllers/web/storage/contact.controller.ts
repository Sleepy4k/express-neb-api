import type { Request, Response } from "express";

import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * Resolve the base directory relative to the current file
 */
const __basedir = path.resolve(fileURLToPath(import.meta.url), "../../../../../storage/app/contact");

/**
 * The home function to render the tutorial page
 *
 * @param {Request} req
 * @param {Response} res
 */
const home = async (req: Request, res: Response) => {
  const filePath = req.params.filePath;
  if (!filePath || filePath.length !== 2) {
    res.status(400).json({
      data: [],
      message: "File path is required",
      status: "error",
    });
    return;
  }

  const fileFullPath = path.join(__basedir, filePath[0], filePath[1]);
  try {
    const data = await fs.readFile(fileFullPath);
    const fileExtension = filePath[1].split(".").pop() ?? "png";

    res.writeHead(200, {
      "Content-Type": fileExtension !== "pdf" ? `image/${fileExtension}` : "application/octet-stream",
      "Content-Disposition": `inline; attachment; filename=${filePath[1]}`,
    });
    res.end(data);
  } catch (err) {
    res.status(500).json({
      data: [],
      message: "File not found",
      status: "error",
    });
  }
};

export { home };
