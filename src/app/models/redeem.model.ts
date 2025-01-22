import BaseModel from "@modules/baseModel.js";
import { RedeemStatus } from "@enums/redeemStatus.js";
import type { RedeemData } from "@interfaces/redeemData.js";

/**
 * The redeem model class
 *
 * @class RedeemModel
 * @extends BaseModel
 */
class RedeemModel extends BaseModel {
  /**
   * The constructor for the RedeemModel class
   */
  public constructor() {
    super('/redeem.json');
  }

  /**
   * Get the redeem data
   *
   * @returns {RedeemData[]}
   */
  public get(): RedeemData[] {
    this.loadData();

    // Parse Record<string, unknown> to RedeemData[]
    return Object.keys(this.data).map((key) => {
      return this.data[key] as RedeemData;
    });
  }

  /**
   * Find the redeem data by code
   *
   * @param {string} code - The code
   *
   * @returns {RedeemData|null} The redeem data
   */
  public find(code: string): RedeemData|null {
    this.loadData();

    return this.data[code] as RedeemData;
  }

  /**
   * Create the redeem data
   *
   * @param {string} code - The code
   * @param {string} name - The name
   *
   * @returns {RedeemData} The redeem data
   */
  public create(code: string, name: string): RedeemData {
    this.loadData();

    const redeemData: RedeemData = {
      code,
      name,
      status: RedeemStatus.PENDING,
      redeemedAt: null,
    };

    this.data[code] = redeemData;
    this.saveData();

    return redeemData;
  }

  /**
   * Find the redeem data by name
   *
   * @param {string} name - The name
   *
   * @returns {RedeemData[]|null} The redeem data
   */
  public findByName(name: string): RedeemData[]|null {
    this.loadData();

    const redeemData = Object.keys(this.data).map((key) => {
      return this.data[key] as RedeemData;
    }).filter((redeem) => redeem.name === name);

    return redeemData || null;
  }

  /**
   * Redeem the code
   *
   * @param {string} code - The code
   *
   * @returns {RedeemData|null} The redeem data
   */
  public redeem(code: string): RedeemData|null {
    this.loadData();

    const redeemData = this.data[code] as RedeemData;
    if (!redeemData) return null;

    redeemData.status = RedeemStatus.REDEEMED;
    redeemData.redeemedAt = new Date().toISOString();

    this.saveData();

    return redeemData;
  }
}

export default RedeemModel;
