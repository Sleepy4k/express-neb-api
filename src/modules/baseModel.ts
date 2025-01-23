import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  isJsonFileExists,
  isDirectoryExists,
  createJsonFile,
  readJsonFileSync,
  writeJsonFileSync
} from "@utils/storage.js";

/**
 * Get path to the root directory using dot-to-parent
 *
 * @note If file path is changed, this should be updated
 *
 * @type {string}
 */
const dotToParent: string = '/../../storage/cache';

/**
 * Get the current file path
 *
 * @type {string}
 */
const currPath: string = fileURLToPath(import.meta.url);

/**
 * Get the base directory from the current file path and the dot-to-parent
 *
 * @type {string}
 */
const __basedir: string = path.resolve(currPath + dotToParent);

/**
 * The base model class
 *
 * @class BaseModel
 */
class BaseModel {
  /**
   * The file path
   *
   * @type {string}
   */
  protected readonly filePath: string;

  /**
   * The data
   *
   * @type {Record<string, unknown>}
   */
  protected data: Record<string, unknown>;

  /**
   * The constructor for the BaseModel class
   *
   * @param {string} filePath - The file path, e.g. data/users.json
   */
  public constructor(filePath: string) {
    this.data = {};
    this.filePath = this.parseFilePath(filePath);

    if (!isJsonFileExists(this.filePath)) {
      createJsonFile(this.filePath);
    }
  }

  /**
   * Parse the file path
   *
   * @param {string} filePath - The file path
   *
   * @returns {string} The parsed file path
   */
  private parseFilePath(filePath: string): string {
    if (filePath.charAt(0) !== '/') {
      filePath = '\\' + filePath;
    }

    const parsedFilePath = path.join(__basedir, filePath.replace(/\//g, '\\'));

    if (!isDirectoryExists(path.dirname(parsedFilePath))) {
      throw new Error('The directory does not exist');
    }

    return parsedFilePath;
  }

  /**
   * Load the data
   *
   * @returns {void}
   */
  public loadData(): void {
    if (!isJsonFileExists(this.filePath)) {
      createJsonFile(this.filePath);
      return;
    }

    this.data = readJsonFileSync(this.filePath);
  }

  /**
   * Save the data
   *
   * @returns {void}
   */
  public saveData(): void {
    writeJsonFileSync(this.filePath, this.data);
  }
}

export default BaseModel;
