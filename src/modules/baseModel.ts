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
 */
const dotToParent = '/../../storage/cache';

/**
 * Get the current file path
 */
const currPath = fileURLToPath(import.meta.url);

/**
 * Get the base directory from the current file path and the dot-to-parent
 */
const __basedir = path.resolve(currPath + dotToParent);

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
   * @param {string} filePath - The file path
   */
  public constructor(filePath: string) {
    this.data = {};
    this.filePath = path.join(__basedir, filePath);

    if (!isDirectoryExists(__basedir)) {
      throw new Error('The directory does not exist');
    }

    if (!isJsonFileExists(this.filePath)) {
      createJsonFile(this.filePath);
    }
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
