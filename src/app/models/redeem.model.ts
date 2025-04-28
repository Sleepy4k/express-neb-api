/* eslint-disable perfectionist/sort-objects */
import { RedeemStatus } from "@enums/redeemStatus.js";
import { type RedeemData } from "@interfaces/redeemData.js";
import BaseModel from "@modules/baseModel.js";

/**
 * The redeem model class
 *
 * @class RedeemModel
 * @extends BaseModel
 */
class RedeemModel extends BaseModel<RedeemData> {
  /**
   * The constructor for the RedeemModel class
   */
  public constructor() {
    super("redeem.json");
  }

  /**
   * Find the redeem data by name
   *
   * @param {string} name - The name
   *
   * @returns {number} The redeem data
   */
  public async countByName(name: string): Promise<number> {
    return (await this.get()).filter((redeem) => redeem.name === name).length;
  }

  /**
   * Create the redeem data
   *
   * @param {string} code - The code
   * @param {string} name - The name
   * @param {string} description - The description
   *
   * @returns {RedeemData} The redeem data
   */
  public async create(code: string, name: string, description: string): Promise<RedeemData> {
    const redeemData: RedeemData = {
      code,
      name,
      description,
      status: RedeemStatus.PENDING,
      createdAt: new Date().toISOString(),
      redeemedAt: null,
    };

    await this.save(code, redeemData);

    return redeemData;
  }

  /**
   * Find the redeem data by name
   *
   * @param {string} name - The name
   *
   * @returns {RedeemData[]|null} The redeem data
   */
  public async findByName(name: string): Promise<null | RedeemData[]> {
    return (await this.get()).filter((redeem) => redeem.name === name);
  }

  /**
   * Redeem the code
   *
   * @param {string} code - The code
   *
   * @returns {RedeemData|null} The redeem data
   */
  public async redeem(code: string): Promise<null | RedeemData> {
    const redeemData = await this.find(code);
    if (!redeemData) return null;

    redeemData.status = RedeemStatus.REDEEMED;
    redeemData.redeemedAt = new Date().toISOString();

    await this.save(code, redeemData);

    return redeemData;
  }
}

export default RedeemModel;
