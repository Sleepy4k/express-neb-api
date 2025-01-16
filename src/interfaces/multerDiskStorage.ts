/**
 * Multer disk storage interface for destination callback
 *
 * @type DestinationCallback
 *
 * @param {Error | null} error - The error
 * @param {string} destination - The destination
 *
 * @returns {void}
 */
type DestinationCallback = (error: Error | null, destination: string) => void

/**
 * Multer disk storage interface for filename callback
 *
 * @type FileNameCallback
 *
 * @param {Error | null} error - The error
 * @param {string} filename - The filename
 *
 * @returns {void}
 */
type FileNameCallback = (error: Error | null, filename: string) => void

export type {
  DestinationCallback,
  FileNameCallback,
};
