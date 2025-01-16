/**
 * Interface for response field
 *
 * @interface IResField
 *
 * @property {string} name - The name of the field
 * @property {string|undefined} value - The value of the field
 */
interface IResField {
  name: string;
  value?: string|undefined;
}

/**
 * Interface for response data
 *
 * @interface IResData
 *
 * @property {string|undefined} status - The status of the response
 * @property {string|undefined} message - The message of the response
 * @property {IResField[]|undefined} data - The data of the response
 */
interface IResData {
  status?: string|undefined;
  message?: string|undefined;
  data?: IResField[]|undefined;
}

export type {
  IResField,
  IResData,
};
