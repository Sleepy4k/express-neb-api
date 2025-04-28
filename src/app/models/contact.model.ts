/* eslint-disable perfectionist/sort-objects */
import { type ContactSubject } from "@enums/contactSubject.js";
import { type ContactData } from "@interfaces/contactData.js";
import BaseModel from "@modules/baseModel.js";

/**
 * The contact model class
 *
 * @class ContactModel
 * @extends BaseModel
 */
class ContactModel extends BaseModel<ContactData> {
  /**
   * The constructor for the ContactModel class
   */
  public constructor() {
    super("contact.json");
  }

  /**
   * Create the redeem data
   *
   * @param {string} code - The code
   * @param {string} name - The name
   * @param {string} description - The description
   *
   * @returns {ContactData} The redeem data
   */
  public async create(name: string, email: string, subject: ContactSubject, message: string, file_url?: string): Promise<ContactData> {
    const code = Math.random().toString(36).substring(2, 15) + email.split("@")[0];
    const contactData: ContactData = {
      name,
      email,
      subject,
      message,
      file_url,
    };

    await this.save(code, contactData);

    return contactData;
  }
}

export default ContactModel;
