import { type RedeemStatus } from "@enums/redeemStatus.js";

/**
 * Redeem Data interface for data type Redeem Data
 *
 * @interface RedeemData
 *
 * @property {string} code - The code
 * @property {string} description - The description
 * @property {string} name - The name
 * @property {RedeemStatus} status - The status
 * @property {string|null} redeemedAt - The redeemed at
 */
interface RedeemData {
  code: string;
  description?: string;
  name: string;
  redeemedAt: null | string;
  status: RedeemStatus;
}

export type { RedeemData };
