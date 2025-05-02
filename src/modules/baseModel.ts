import { createJsonFile, isDirectoryExists, isJsonFileExists, readJsonFileSync, writeJsonFileSync } from "@utils/storage.js";
import { Mutex } from "async-mutex";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get the base directory from the current file path and the dot-to-parent
 *
 * @type {string}
 */
const __basedir: string = path.resolve(fileURLToPath(import.meta.url), "../../storage/cache");

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
   * The last modification time of the data file
   */
  private lastModificationTime: null | number = null;

  /**
   * Mutex to prevent race conditions
   */
  private mutex = new Mutex();

  /**
   * The constructor for the BaseModel class
   *
   * @param {string} filePath - The file path, e.g. data/users.json
   */
  protected constructor(filePath: string) {
    this.filePath = this.parseFilePath(filePath);
    this.ensureFileExists();
    this.updateLastModificationTime();
  }

  /**
   * Get the total number of items in the data
   *
   * @returns {number} The total number of items in the data
   */
  public async count(): Promise<number> {
    await this.loadDataIfNeeded();
    return Object.keys(this.data).length;
  }

  /**
   * Remove an item by its key
   *
   * @param {string} key - The key of the item to remove
   * @returns {Promise<boolean>} True if the item was removed, false otherwise
   */
  public async delete(key: string): Promise<boolean> {
    const unlock = await this.mutex.acquire();
    try {
      await this.loadDataIfNeeded();

      if (this.data[key]) {
        this.data = Object.fromEntries(Object.entries(this.data).filter(([k]) => k !== key));
        await this.saveData();
        return true;
      }

      return false;
    } finally {
      unlock();
    }
  }

  /**
   * Get a specific item by its key
   *
   * @param {string} key - The key of the item
   * @returns {Promise<T | undefined>} The item if found, otherwise undefined
   */
  public async find(key: string): Promise<T | undefined> {
    await this.loadDataIfNeeded();
    return this.data[key];
  }

  /**
   * Get the data from the file
   *
   * @returns {Promise<T[]>}
   */
  public async get(): Promise<T[]> {
    await this.loadDataIfNeeded();
    return Object.values(this.data);
  }

  /**
   * Add a new item or update an existing item
   *
   * @param {string} key - The key for the item
   * @param {T} item - The item to add or update
   * @returns {Promise<void>}
   */
  public async save(key: string, item: T): Promise<void> {
    const unlock = await this.mutex.acquire();
    try {
      await this.loadDataIfNeeded();
      this.data[key] = item;
      await this.saveData();
    } finally {
      unlock();
    }
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
   * Check if the data has changed by comparing the last modification time
   *
   * @returns {boolean} True if the data has changed, otherwise false
   */
  private isDataChanged(): boolean {
    try {
      const stats = fs.statSync(this.filePath);
      const currentModificationTime = stats.mtimeMs;
      return currentModificationTime !== this.lastModificationTime;
    } catch {
      return false;
    }
  }

  /**
   * Load the data
   *
   * @returns {Promise<void>}
   */
  private async loadData(): Promise<void> {
    try {
      this.data = (await readJsonFileSync(this.filePath)) as Record<string, T>;
    } catch {
      this.data = {};
      this.ensureFileExists();
    }
  }

  /**
   * Load the data from the file if it hasn't been loaded yet
   *
   * @returns {Promise<void>}
   */
  private async loadDataIfNeeded(): Promise<void> {
    if (!this.isDataLoaded || this.isDataChanged()) {
      await this.loadData();
      this.updateLastModificationTime();
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
   * @returns {Promise<void>}
   */
  private async saveData(): Promise<void> {
    await writeJsonFileSync(this.filePath, this.data);
    this.updateLastModificationTime();
  }

  /**
   * Update the last modification time of the data file
   *
   * @returns {void}
   */
  private updateLastModificationTime(): void {
    try {
      const stats = fs.statSync(this.filePath);
      this.lastModificationTime = stats.mtimeMs;
    } catch {
      this.lastModificationTime = null;
    }
  }
}

export default BaseModel;
