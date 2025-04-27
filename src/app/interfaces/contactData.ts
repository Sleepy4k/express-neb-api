/* eslint-disable perfectionist/sort-interfaces */
import { type ContactSubject } from "@enums/contactSubject.js";

/**
 * Redeem Data interface for data type Redeem Data
 *
 * @interface ContactData
 */
interface ContactData {
  name: string;
  email: string;
  subject: ContactSubject;
  message: string;
  file_url?: string;
}

export type { ContactData };
