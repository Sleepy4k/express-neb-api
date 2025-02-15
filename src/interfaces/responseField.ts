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
  data?: IResField[] | undefined;
  message?: string | undefined;
  status?: string | undefined;
}

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
  value?: string | undefined;
}

export type { IResData, IResField };
