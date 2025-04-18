/* eslint-disable @typescript-eslint/restrict-plus-operands */
import CryptoES from "crypto-es";

/**
 * Global salt used for encryption and decryption.
 * This should be kept secret and not hardcoded in production code.
 * In a real-world application, consider using a secure random generator
 *
 * @constant {string}
 */
const SALT = Math.random().toString(36).substring(2, 15);

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
};

/**
 * Generates a 32-character encryption key from the given salt.
 *
 * @param {string} salt - The salt to use for key generation
 *
 * @returns {string} The generated encryption key
 *
 * @example
 * generateEncryptionKey('salt'); // => 'salt salt salt salt'
 */
const generateEncryptionKey = (salt: string): string => {
  let key = salt;

  while (key.length < 32) {
    key += salt;
  }

  return key.substring(0, 32);
};

/**
 * Encrypts the given data using a simple XOR cipher with a derived key.
 * The ciphertext is base64 encoded and prefixed with the salt and key hash.
 *
 * @param {string} data - The data to encrypt
 *
 * @returns {string} The encrypted data
 *
 * @example
 * encryptAuthVerify('data'); // => 'cGF5bG9hZA=='
 */
const encryptAuthVerify = (data: string): string => {
  if (!data) return "";

  const key = generateEncryptionKey(SALT);

  let ciphertext = "";
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    const keyCharCode = key.charCodeAt(i % key.length);
    const encryptedCharCode = (charCode ^ keyCharCode) + (i % 15);
    ciphertext += String.fromCharCode(encryptedCharCode);
  }

  const keyHash = btoa(Array.from(new TextEncoder().encode(key)).reduce((acc, byte) => acc + byte, ""));
  return btoa(SALT + ":" + keyHash.substring(0, 12) + ":" + ciphertext);
};

/**
 * Decrypts the given ciphertext using a simple XOR cipher with a derived key.
 * The ciphertext is expected to be base64 encoded and prefixed with the salt and key hash.
 *
 * @param {string} ciphertext - The data to decrypt
 *
 * @returns {string} The decrypted data
 *
 * @example
 * decryptAuthVerify('cGF5bG9hZA=='); // => 'data'
 */
const decryptAuthVerify = (ciphertext: string): string => {
  if (!ciphertext) return "";

  try {
    const decodedCiphertext = atob(ciphertext);
    const parts = decodedCiphertext.split(":");
    if (parts.length !== 3) return "Decryption Error: Invalid ciphertext format.";

    const receivedSalt = parts[0];
    const receivedKeyHash = parts[1];
    const encryptedData = parts[2];

    if (receivedSalt !== SALT) return "Decryption Error: Incorrect salt - potential tampering.";

    const expectedKey = generateEncryptionKey(SALT);
    const expectedKeyHash = btoa(Array.from(new TextEncoder().encode(expectedKey)).reduce((acc, byte) => acc + byte, "")).substring(0, 12);
    if (receivedKeyHash !== expectedKeyHash) return "Decryption Error: Integrity check failed (key mismatch).";

    let plaintext = "";
    for (let i = 0; i < encryptedData.length; i++) {
      const encryptedCharCode = encryptedData.charCodeAt(i);
      const keyCharCode = expectedKey.charCodeAt(i % expectedKey.length);
      const decryptedCharCode = (encryptedCharCode - (i % 15)) ^ keyCharCode; // Ensure correct order of operations
      plaintext += String.fromCharCode(decryptedCharCode);
    }

    return plaintext;
  } catch {
    return "Decryption Error: Could not decode ciphertext.";
  }
};

export { decryptAuthVerify, encryptAuthVerify, sha256 };
