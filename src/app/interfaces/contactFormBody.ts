/**
 * The interface for the request body
 *
 * @interface IContactFormBody
 *
 * @property {string} email - The email address of the user
 * @property {string} message - The message content
 * @property {string} name - The name of the user
 * @property {string} subject - The subject of the message
 */
interface IContactFormBody {
  email: string;
  message: string;
  name: string;
  subject: string;
}

export type { IContactFormBody };
