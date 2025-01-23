import { appConfig } from "@config";

/**
 * Generate a nonce based on the app name
 *
 * @returns {number} The generated nonce
 */
const generateNonce = (): number => {
  return appConfig.name.split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export default generateNonce;