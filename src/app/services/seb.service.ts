import type { Request } from "express";

import { serviceConfig } from "@config/service.config.js";
import { defaultEncoder } from "@constants/encoder.js";
import { REFERER, SEB_CKH_HTTP_HEADER_NAME, SEB_RH_HTTP_HEADER_NAME, USER_AGENT_HEADER_NAME } from "@constants/header.js";
import SebFile from "@modules/seb.js";
import UserAgentGenerator from "@modules/userAgent.js";
import { base64 } from "@utils/encryption.js";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * The user agent generator instance for the service controller
 *
 * @type {UserAgentGenerator}
 */
const userAgentGenerator: UserAgentGenerator = new UserAgentGenerator();

const SebService = {
  /**
   * Build the response fields for the SEB file
   *
   * @param {SebFile} sebFile - The SEB file
   * @param {string} fileName - The file name
   *
   * @returns {{ name: string; value: string | undefined }[]} The response fields
   */
  buildResponseFields(sebFile: SebFile, fileName: string): { name: string; value: string | undefined }[] {
    return [
      ...(serviceConfig.response.showStartUrl ? [{ name: REFERER, value: sebFile.StartUrl }] : []),
      ...(serviceConfig.response.showUserAgent
        ? [{ name: USER_AGENT_HEADER_NAME, value: userAgentGenerator.generate() ?? "default-user-agent" }]
        : []),
      ...(serviceConfig.response.showRequestHash ? [{ name: SEB_RH_HTTP_HEADER_NAME, value: sebFile.RequestHash }] : []),
      ...(serviceConfig.response.showConfigHash ? [{ name: SEB_CKH_HTTP_HEADER_NAME, value: sebFile.getConfigKey(sebFile.StartUrl ?? "") }] : []),
      { name: "File-Name", value: fileName || "Naka Exam Bypasser" },
      ...(serviceConfig.response.showSerializedJson ? [{ name: "Serialized", value: sebFile.SerializedJson }] : []),
      ...(serviceConfig.response.showDictionnary ? [{ name: "Dictionary", value: JSON.stringify(sebFile.Dictionnary) }] : []),
    ];
  },

  /**
   * Cache the SEB file result
   *
   * @param {string} resultFilePath - The result file path
   * @param {SebFile} sebFile - The SEB file
   *
   * @returns {Promise<void>}
   */
  async cacheResult(resultFilePath: string, sebFile: SebFile): Promise<void> {
    const dir = path.dirname(resultFilePath);
    if (!(await fs.stat(dir).catch(() => false))) {
      await fs.mkdir(dir, { recursive: true });
    }
    await fs.writeFile(resultFilePath, JSON.stringify(sebFile, null, 2), { encoding: defaultEncoder });
  },

  /**
   * Generate a file hash based on parsed data and file size
   *
   * @param {Record<string, unknown>} parsedData - The parsed data
   * @param {number} fileSize - The file size
   *
   * @returns {string} The generated file hash
   */
  generateFileHash(parsedData: Record<string, unknown>, fileSize: number): string {
    const sendBrowserExamKey = (parsedData.sendBrowserExamKey as boolean) ? "1" : "0";
    const startURL = typeof parsedData.startURL === "string" ? parsedData.startURL : "no-start-url";
    return base64(`${fileSize.toString()}-${sendBrowserExamKey}-${Object.keys(parsedData).length.toString()}-${startURL}`);
  },

  /**
   * Get cached SEB file if available
   *
   * @param {string} resultFilePath - The result file path
   * @param {string} uploadedFilePath - The uploaded file path
   *
   * @returns {Promise<unknown>} The cached SEB file or null
   */
  async getCachedSebFile(resultFilePath: string, uploadedFilePath: string): Promise<unknown> {
    try {
      const data = await fs.readFile(resultFilePath, { encoding: defaultEncoder });
      const sebFile = JSON.parse(data) as SebFile;
      await fs.unlink(uploadedFilePath).catch((err: unknown) => {
        console.log(`Error deleting file: ${String(err)}`);
      });

      return {
        code: 200,
        data: this.buildResponseFields(sebFile, ""),
        message: "SEB file processed successfully (from cache)",
        status: "success",
      };
    } catch {
      return null;
    }
  },

  /**
   * Get the result file path based on the request and hash
   *
   * @param {Request} req - The request object
   * @param {string} hash - The unique hash
   *
   * @returns {string} The result file path
   */
  getResultFilePath(req: Request<object, object, { file_name: string }>, hash: string): string {
    const basedir = path.resolve(req.app.get("basePath") as string, "storage/app/seb/results");
    return path.join(basedir, `${hash}.json`);
  },

  /**
   * Validate and read the uploaded SEB file
   *
   * @param {string} filePath - The file path
   *
   * @returns {Promise<string>} The file content
   */
  async validateAndReadFile(filePath: string): Promise<string> {
    const stats = await fs.stat(filePath);
    if (stats.size === 0) {
      throw new Error("Uploaded file is empty");
    }
    return fs.readFile(filePath, { encoding: defaultEncoder });
  },
};

export default SebService;
