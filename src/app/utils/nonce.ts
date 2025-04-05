import CryptoJS from "crypto-es";

/**
 * Generate a nonce based on the app name
 *
 * @param {number} lengthBytes The length of the nonce in bytes
 * @returns {string} The generated nonce
 */
const generateNonce = (lengthBytes?: number): string => {
  const randomBytes = CryptoJS.lib.WordArray.random(lengthBytes ?? 16);
  return CryptoJS.enc.Hex.stringify(randomBytes);
};

export default generateNonce;
