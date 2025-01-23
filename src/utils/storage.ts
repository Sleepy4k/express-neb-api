import fs from 'node:fs';
import { defaultEncoder } from '@constants/encoder.js';

/**
 * Check if a JSON file exists
 *
 * @param {string} filePath - The file path
 *
 * @returns {boolean} Whether the JSON file exists
 */
const isJsonFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath);
}

/**
 * Check if a directory exists
 *
 * @param {string} directoryPath - The directory path
 *
 * @returns {boolean} Whether the directory exists
 */
const isDirectoryExists = (directoryPath: string): boolean => {
  const isExists = fs.existsSync(directoryPath);

  try {
    // if the directory does not exist, create it
    if (!isExists) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
}

/**
 * Create a JSON file
 *
 * @param {string} filePath - The file path
 *
 * @returns {void}
 */
const createJsonFile = (filePath: string): void => {
  fs.writeFileSync(filePath, '{}', defaultEncoder);
}

/**
 * Read a JSON file synchronously
 *
 * @param {string} filePath - The file path
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Record<string, unknown>} The JSON data
 */
const readJsonFileSync = (
  filePath: string,
  encoding?: BufferEncoding
): Record<string, unknown> => {
  if (typeof encoding === 'undefined' || encoding === null) {
    encoding = defaultEncoder;
  }

  const data = fs.readFileSync(filePath, encoding);
  return JSON.parse(data);
}

/**
 * Read a JSON file asynchronously
 *
 * @param {string} filePath - The file path
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Promise<Record<string, unknown>>} The JSON data
 */
const readJsonFileAsync = (
  filePath: string,
  encoding?: BufferEncoding
): Promise<Record<string, unknown>> => {
  if (typeof encoding === 'undefined' || encoding === null) {
    encoding = defaultEncoder;
  }

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * Write a JSON file synchronously
 *
 * @param {string} filePath - The file path
 * @param {Record<string, unknown>} data - The JSON data
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {void}
 */
const writeJsonFileSync = (
  filePath: string,
  data: Record<string, unknown>,
  encoding?: BufferEncoding
): void => {
  if (typeof encoding === 'undefined' || encoding === null) {
    encoding = defaultEncoder;
  }

  const stringifiedData = JSON.stringify(data, null, 2);

  fs.writeFileSync(filePath, stringifiedData, encoding);
}

/**
 * Write a JSON file asynchronously
 *
 * @param {string} filePath - The file path
 * @param {Record<string, unknown>} data - The JSON data
 * @param {BufferEncoding} [encoding] - The encoding
 *
 * @returns {Promise<void>} The promise
 */
const writeJsonFileAsync = (
  filePath: string,
  data: Record<string, unknown>,
  encoding?: BufferEncoding
): Promise<void> => {
  if (typeof encoding === 'undefined' || encoding === null) {
    encoding = defaultEncoder;
  }

  const stringifiedData = JSON.stringify(data, null, 2);

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, stringifiedData, encoding, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

export {
  isJsonFileExists,
  createJsonFile,
  isDirectoryExists,
  readJsonFileSync,
  readJsonFileAsync,
  writeJsonFileSync,
  writeJsonFileAsync,
};
