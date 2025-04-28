import { defaultEncoder } from "@constants/encoder.js";
import { isValueNullOrUndefined } from "@utils/parse.js";
import fso from "node:fs";
import fs from "node:fs/promises";

/**
 * Check if a JSON file exists
 *
 * @param {string} filePath - The file path
 *
 * @returns {boolean} Whether the JSON file exists
 */
const isJsonFileExists = (filePath: string): boolean => {
  return fso.existsSync(filePath);
};

/**
 * Check if a directory exists
 *
 * @param {string} directoryPath - The directory path
 *
 * @returns {boolean} Whether the directory exists
 */
const isDirectoryExists = (directoryPath: string): boolean => {
  return fso.existsSync(directoryPath);
};

/**
 * Create a JSON file
 *
 * @param {string} filePath - The file path
 *
 * @returns {void}
 */
const createJsonFile = (filePath: string): void => {
  fso.writeFileSync(filePath, "{}", defaultEncoder);
};

/**
 * Read a JSON file synchronously
 *
 * @param {string} filePath - The file path
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Record<string, unknown>} The JSON data
 */
const readJsonFileSync = async (filePath: string, encoding?: BufferEncoding): Promise<Record<string, unknown>> => {
  if (isValueNullOrUndefined(encoding)) encoding = defaultEncoder;

  const data = await fs.readFile(filePath, encoding);

  return JSON.parse(data.toString()) as Record<string, unknown>;
};

/**
 * Read a JSON file asynchronously
 *
 * @param {string} filePath - The file path
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Promise<Record<string, unknown>>} The JSON data
 */
const readJsonFileAsync = async (filePath: string, encoding?: BufferEncoding): Promise<Record<string, unknown>> => {
  if (isValueNullOrUndefined(encoding)) encoding = defaultEncoder;

  try {
    const data = await fs.readFile(filePath, { encoding });
    return JSON.parse(data.toString()) as Record<string, unknown>;
  } catch (error: unknown) {
    console.log(`Error reading JSON file: ${String(error)}`);
    return {} as Record<string, unknown>;
  }
};

/**
 * Write a JSON file synchronously
 *
 * @param {string} filePath - The file path
 * @param {Record<string, unknown>} data - The JSON data
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {void}
 */
const writeJsonFileSync = async (filePath: string, data: Record<string, unknown>, encoding?: BufferEncoding): Promise<void> => {
  if (isValueNullOrUndefined(encoding)) encoding = defaultEncoder;

  const stringifiedData = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, stringifiedData, encoding);
};

/**
 * Write a JSON file asynchronously
 *
 * @param {string} filePath - The file path
 * @param {Record<string, unknown>} data - The JSON data
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Promise<void>} The promise
 */
const writeJsonFileAsync = (filePath: string, data: Record<string, unknown>, encoding?: BufferEncoding): Promise<void> => {
  if (isValueNullOrUndefined(encoding)) encoding = defaultEncoder;

  const stringifiedData = JSON.stringify(data, null, 2);

  try {
    return fs.writeFile(filePath, stringifiedData, { encoding });
  } catch (error: unknown) {
    console.log(`Error writing JSON file: ${String(error)}`);
    return Promise.reject(error as Error);
  }
};

export { createJsonFile, isDirectoryExists, isJsonFileExists, readJsonFileAsync, readJsonFileSync, writeJsonFileAsync, writeJsonFileSync };
