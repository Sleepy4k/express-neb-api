import CryptoES from 'crypto-es';

/**
 * Hashes the given data using the SHA-256 algorithm.
 *
 * @param {string} data - The data to hash
 *
 * @returns {string} The hashed data
 *
 * @example
 * sha256('data'); // => '3d3fxxxxxx'
 */
const sha256 = (data: string): string => {
  return CryptoES.SHA256(data).toString(CryptoES.enc.Hex);
}

export {
  sha256,
};