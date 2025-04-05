import { createJsonFile, isDirectoryExists, isJsonFileExists, readJsonFileSync, writeJsonFileSync } from "@utils/storage.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get path to the root directory using dot-to-parent
 *
 * @note If file path is changed, this should be updated
 */
const dotToParent = "/../../storage/cache";

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
class BaseModel<T> {
  /**
   * The data
   *
   * @type {Record<string, T>}
   */
  protected data: Record<string, T> = {};

  /**
   * The file path
   *
   * @type {string}
   */
  protected readonly filePath: string;

  /**
   * A flag to track if data has been loaded
   */
  private isDataLoaded = false;

  /**
   * The constructor for the BaseModel class
   *
   * @param {string} filePath - The file path, e.g. data/users.json
   */
  protected constructor(filePath: string) {
    this.filePath = this.parseFilePath(filePath);
    this.ensureFileExists();
  }

  /**
   * Get the total number of items in the data
   *
   * @returns {number} The total number of items in the data
   */
  public count(): number {
    this.loadDataIfNeeded();
    return Object.keys(this.data).length;
  }

  /**
   * Remove an item by its key
   *
   * @param {string} key - The key of the item to remove
   * @returns {boolean} True if the item was removed, false otherwise
   */
  public delete(key: string): boolean {
    this.loadDataIfNeeded();

    if (this.data[key]) {
      this.data = Object.fromEntries(Object.entries(this.data).filter(([k]) => k !== key));
      this.saveData();
      return true;
    }

    return false;
  }

  /**
   * Get a specific item by its key
   *
   * @param {string} key - The key of the item
   * @returns {T | undefined} The item if found, otherwise undefined
   */
  public find(key: string): T | undefined {
    this.loadDataIfNeeded();
    return this.data[key];
  }

  /**
   * Get the data from the file
   *
   * @returns {T[]}
   */
  public get(): T[] {
    this.loadDataIfNeeded();
    return Object.values(this.data);
  }

  /**
   * Add a new item or update an existing item
   *
   * @param {string} key - The key for the item
   * @param {T} item - The item to add or update
   * @returns {void}
   */
  public save(key: string, item: T): void {
    this.loadDataIfNeeded();
    this.data[key] = item;
    this.saveData();
  }

  /**
   * Ensures the JSON file exists. Creates it if it doesn't.
   */
  private ensureFileExists(): void {
    if (isJsonFileExists(this.filePath)) return;

    createJsonFile(this.filePath);
    this.data = {};
    this.isDataLoaded = true;
  }

  /**
   * Load the data
   *
   * @returns {void}
   */
  private loadData(): void {
    try {
      this.data = readJsonFileSync(this.filePath) as Record<string, T>;
    } catch {
      this.data = {};
      this.ensureFileExists();
    }
  }

  /**
   * Load the data from the file if it hasn't been loaded yet
   *
   * @returns {void}
   */
  private loadDataIfNeeded(): void {
    if (!this.isDataLoaded) {
      this.loadData();
      this.isDataLoaded = true;
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
    const normalizedFilePath = filePath.replace(/\//g, path.sep);
    const resolvedPath = path.resolve(__basedir, normalizedFilePath);
    const directory = path.dirname(resolvedPath);

    if (!isDirectoryExists(directory)) {
      try {
        fs.mkdirSync(directory, { recursive: true });
      } catch (error) {
        console.error(`Error creating directory ${directory}:`, error);
        throw new Error(`Could not create directory: ${directory}`);
      }
    }

    return resolvedPath;
  }

  /**
   * Save the data
   *
   * @returns {void}
   */
  private saveData(): void {
    writeJsonFileSync(this.filePath, this.data);
  }
}

export default BaseModel;
