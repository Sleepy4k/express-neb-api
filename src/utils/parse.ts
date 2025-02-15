import type { XMLDictionary, XMLValue } from "@interfaces/xmlFile.js";

import { DOMParser } from "@xmldom/xmldom";

import { Node } from "./dom.js";

/**
 * The regex to check if the hostname is a URL
 */
const regex = new RegExp("^(http|https)://", "i");

/**
 * Check if a value is null or undefined
 *
 * @param {unknown} value - The value to check
 *
 * @returns {boolean} True if the value is null or undefined, false otherwise
 */
const isValueNullOrUndefined = (value: unknown): boolean => {
  return value === null || value === undefined || typeof value === "undefined" || (typeof value === "string" && value.trim() === "");
};

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {any} val - The port value
 *
 * @returns {any} The normalized port value
 */
const normalizePort = (val: number | string): false | number | string => {
  const port = parseInt(val.toString(), 10);

  if (isNaN(port)) return val;
  if (port >= 0) return port;

  return false;
};

/**
 * Parse the hostname
 *
 * @param {string|null} host - The hostname
 *
 * @returns {string} The parsed hostname
 */
const parseHostname = (host?: null | string): string => {
  if (!host) return "https://localhost";

  return regex.test(host) ? host : "https://" + host;
};

/**
 * Process the XML value
 *
 * @param {Node} node - The XML node
 *
 * @returns {XMLValue} The processed XML value
 */
const processXMLValue = (node: Node): XMLValue => {
  switch (node.nodeName) {
    case "array":
      return handleXMLValArray(node);
    case "data":
    case "string":
      return node.textContent?.trim() ?? "";
    case "dict":
      return handleXMLValDict(node);
    case "false":
      return false;
    case "integer":
      return parseInt(node.textContent ?? "0", 10);
    case "real":
      return parseFloat(node.textContent ?? "0");
    case "true":
      return true;
    default:
      return undefined;
  }
};

/**
 * Handle an XML value array
 *
 * @param {Node} node - The XML node
 *
 * @returns {XMLValue[]} The XML value array
 */
const handleXMLValArray = (node: Node): XMLValue[] => {
  return Array.from(node.childNodes)
    .filter((childNode) => childNode.nodeType === Node.ELEMENT_NODE)
    .map((childNode) => processXMLValue(childNode))
    .filter((value) => value !== undefined) as XMLValue[];
};

/**
 * Handle an XML value dictionary
 *
 * @param {Node} node - The XML node
 *
 * @returns {XMLDictionary} The XML value dictionary
 */
const handleXMLValDict = (node: Node): XMLDictionary => {
  const nestedDict: XMLDictionary = {};
  let nestedKey: null | string = null;

  Array.from(node.childNodes).forEach((childNode) => {
    if (childNode.nodeType !== Node.ELEMENT_NODE) return;

    if (childNode.nodeName === "key") {
      nestedKey = childNode.textContent ?? null;
      return;
    }

    if (!nestedKey) return;

    const value = processXMLValue(childNode);
    if (value !== undefined) nestedDict[nestedKey] = value;

    nestedKey = null; // Reset nestedKey after adding value
  });

  return nestedDict;
};

/**
 * Parse an XML string into a dictionary
 *
 * @param {string} htmlString - The XML string
 *
 * @returns {XMLDictionary|undefined} The parsed XML dictionary
 */
const parseXMLString = (htmlString: string): undefined | XMLDictionary => {
  let currentKey: null | string = null;

  /**
   * Handle a node in the XML
   *
   * @param {Node} node - The XML node
   * @param {XMLDictionary} dict - The XML dictionary
   *
   * @returns {void}
   */
  function handleNode(node: Node, dict: XMLDictionary): void {
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    if (node.nodeName === "key") {
      currentKey = node.textContent ?? null;
      return;
    }

    if (!currentKey) {
      Array.from(node.childNodes).forEach((childNode) => {
        handleNode(childNode, dict);
      });
      return;
    }

    const value = processXMLValue(node);
    if (value !== undefined) dict[currentKey] = value;

    currentKey = null; // Reset currentKey after adding value
  }

  const parser = new DOMParser();

  try {
    const dictionary: XMLDictionary = {};
    const doc = parser.parseFromString(htmlString, "text/xml");

    const dicts = doc.getElementsByTagName("dict");
    if (dicts.length > 0) {
      const dict = dicts[0];
      Array.from(dict.childNodes).forEach((currentNode) => {
        handleNode(currentNode as unknown as Node, dictionary);
      });
    }

    return dictionary;
  } catch (e) {
    console.error("Error parsing XML:", e);
    return;
  }
};

/**
 * Serialize an XML dictionary into a string
 *
 * @param {XMLDictionary} dictionary - The XML dictionary
 *
 * @returns {string} The serialized XML string
 */
const serialize = (dictionary: XMLDictionary): string => {
  /**
   * Serialize a value into a string based on its type
   *
   * @param {XMLValue} value - The value to serialize
   *
   * @returns {string} The serialized value
   */
  function _serialize(value: XMLValue): string {
    if (Array.isArray(value)) {
      return _serializeList(value);
    } else if (value instanceof Uint8Array) {
      return `"${btoa(String.fromCharCode(...new Uint8Array(value)))}"`;
    } else if (value instanceof Date) {
      return `"${value.toISOString()}"`;
    } else if (value && typeof value === "object") {
      return serialize(value);
    } else if (typeof value === "boolean" || typeof value === "number") {
      return value.toString();
    } else if (typeof value === "string") {
      return `"${value}"`;
    } else {
      return '""';
    }
  }

  /**
   * Serialize a list of values into a string
   *
   * @param {XMLValue[]} list - The list of values
   *
   * @returns {string} The serialized list
   */
  function _serializeList(list: XMLValue[]): string {
    return "[" + list.map(_serialize).join(",") + "]";
  }

  /**
   * Serialize an object into a string
   *
   * @param {XMLDictionary} obj - The object to serialize
   *
   * @returns {string} The serialized object
   */
  function serialize(obj: XMLDictionary): string {
    const result = Object.keys(obj)
      .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
      .filter((key) => {
        const value = obj[key];
        const isOriginator = key.toLowerCase() === "originatorversion";
        const isObject = value && typeof value === "object" && !Array.isArray(value);
        const isEmpty = value && Object.keys(value).length === 0;

        return !isOriginator && (!isObject || !isEmpty);
      })
      .map((key) => `"${key}":${_serialize(obj[key])}`)
      .join(",");

    return `{${result}}`;
  }

  return serialize(dictionary);
};

/**
 * Convert a name to a redeem code
 *
 * @param {string} name - The name
 *
 * @returns {string} The redeem code
 */
const nameToRedeemCode = (name: string): string => {
  const currentDate = new Date();
  const day: string = String(currentDate.getDate()).padStart(2, "0");
  const month: string = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year: string = currentDate.getFullYear().toString();

  const reversedName = name.toLowerCase().split("").reverse().join("").replace(/\s+/g, "-");

  return `${day}${month}${year}-${reversedName}`;
};

export { isValueNullOrUndefined, nameToRedeemCode, normalizePort, parseHostname, parseXMLString, serialize };
