/**
 * Enum for Redeem Status
 *
 * @readonly
 *
 * @enum {string} RedeemStatus
 *
 * @property {string} PENDING - The pending status
 * @property {string} REDEEMED - The redeemed status
 */
enum ContactSubject {
  GENERAL = "general",
  PAYMENT = "payment",
  TECHNICAL = "technical",
}

/**
 * The list of contact subjects for the contact form
 */
const ContactSubjectList = [
  { name: "General Inquiry", value: ContactSubject.GENERAL },
  { name: "Payment Issue", value: ContactSubject.PAYMENT },
  { name: "Technical Support", value: ContactSubject.TECHNICAL },
];

export { ContactSubject, ContactSubjectList };
