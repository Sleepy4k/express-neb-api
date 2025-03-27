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

/**
 * XML Value type for data type XML File
 *
 * @type XMLValue
 */
type XMLValue = boolean | number | string | undefined | XMLDictionary | XMLValue[];

export type { XMLDictionary, XMLValue };
