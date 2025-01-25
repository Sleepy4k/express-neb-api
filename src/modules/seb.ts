import { sha256 } from '@utils/encryption.js';
import {
  serialize,
  parseXMLString
} from '@utils/parse.js';
import type {
  XMLDictionary
} from '@interfaces/xmlFile.js';

/**
 * The SEB file class
 *
 * @class SebFile
 */
class SebFile {
  /**
   * The XML dictionary
   *
   * @type {XMLDictionary}
   */
  public readonly Dictionnary: XMLDictionary;

  /**
   * The serialized JSON
   *
   * @type {string}
   */
  public readonly SerializedJson: string;

  /**
   * The start URL
   *
   * @type {string|undefined}
   */
  public readonly StartUrl: string | undefined;

  /**
   * The configuration hash
   *
   * @type {string}
   */
  public readonly ConfigHash: string;

  /**
   * The request hash
   *
   * @type {string}
   */
  public readonly RequestHash: string;

  /**
   * The constructor for the SebFile class
   *
   * @param {XMLDictionary} dictionnary - The XML dictionary
   * @param {string} serializedJson - The serialized JSON
   * @param {string|undefined} startUrl - The start URL
   * @param {string} configKey - The configuration hash
   * @param {string} requestKey - The request hash
   */
  private constructor(
    dictionnary: XMLDictionary,
    serializedJson: string,
    startUrl: string|undefined,
    configKey: string,
    requestKey: string
  ) {
    this.Dictionnary = dictionnary;
    this.SerializedJson = serializedJson;
    this.StartUrl = startUrl;
    this.ConfigHash = configKey;
    this.RequestHash = requestKey;
  }

  /**
   * Create an instance of the SebFile class
   *
   * @param {string} sebXML - The SEB XML file
   *
   * @returns {Promise<SebFile|undefined>} The SebFile instance or undefined
   */
  public static async createInstance(sebXML: string): Promise<SebFile|undefined> {
    const dictionnary = parseXMLString(sebXML);
    if (!dictionnary) return;

    const serializedJson = serialize(dictionnary);
    const startUrl = this.getStartUrl(dictionnary);
    const configHash = this.getConfigHash(serializedJson);
    const requestHash = this.getRequestHash(dictionnary);

    return new SebFile(dictionnary, serializedJson, startUrl, configHash, requestHash);
  }

  /**
   * Get the configuration key
   *
   * @param {string} url - The URL
   *
   * @returns {string} The configuration key
   */
  public getConfigKey(url: string) {
    return sha256(url + this.ConfigHash);
  }

  /**
   * Get the start URL from the XML dictionary
   *
   * @param {XMLDictionary} dictionnary - The XML dictionary
   *
   * @returns {string|undefined} The start URL or undefined
   */
  private static getStartUrl(dictionnary: XMLDictionary): string|undefined {
    const startUrl = dictionnary["startURL"];
    if (typeof startUrl !== "string") return undefined;

    return startUrl;
  }

  /**
   * Get the configuration hash
   *
   * @param {string} serializedJson - The serialized JSON
   *
   * @returns {string} The configuration hash
   */
  private static getConfigHash(serializedJson: string): string {
    return sha256(serializedJson);
  }

  /**
   * Get the request hash
   *
   * @param {XMLDictionary} dictionnary - The XML dictionary
   *
   * @returns {string} The request hash
   */
  private static getRequestHash(dictionnary: XMLDictionary): string {
    const keySalt = dictionnary["examKeySalt"];
    const key = keySalt && typeof keySalt === "string"
      ? new Uint32Array(keySalt.split(',').map(Number))
      : new Uint32Array();

    return sha256(key.toString());
  }
}

export default SebFile;
