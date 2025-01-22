/**
 * XML Value type for data type XML File
 *
 * @type XMLValue
 */
type XMLValue = string | number | boolean | XMLValue[] | XMLDictionary | undefined;

/**
 * XML Dictionary interface for data type XML File
 *
 * @interface XMLDictionary
 *
 * @property {XMLValue} key - The key
 */
interface XMLDictionary {
  [key: string]: XMLValue;
}

export type {
  XMLValue,
  XMLDictionary,
}