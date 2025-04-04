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
class RedeemModel extends BaseModel {
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
  public countByName(name: string): number {
    this.loadData();

    const redeemData = Object.values(this.data).filter((redeem) => (redeem as RedeemData).name === name) as RedeemData[];

    return redeemData.length;
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
  public create(code: string, name: string, description: string): RedeemData {
    this.loadData();

    const redeemData: RedeemData = {
      code,
      name,
      description,
      status: RedeemStatus.PENDING,
      createdAt: new Date().toISOString(),
      redeemedAt: null,
    };

    this.data[code] = redeemData;
    this.saveData();

    return redeemData;
  }

  /**
   * Find the redeem data by code
   *
   * @param {string} code - The code
   *
   * @returns {RedeemData|null} The redeem data
   */
  public find(code: string): null | RedeemData {
    this.loadData();

    return this.data[code] as RedeemData;
  }

  /**
   * Find the redeem data by name
   *
   * @param {string} name - The name
   *
   * @returns {RedeemData[]|null} The redeem data
   */
  public findByName(name: string): null | RedeemData[] {
    this.loadData();

    const redeemData = Object.keys(this.data)
      .map((key) => {
        return this.data[key] as RedeemData;
      })
      .filter((redeem) => redeem.name === name);

    return redeemData;
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
   * Redeem the code
   *
   * @param {string} code - The code
   *
   * @returns {RedeemData|null} The redeem data
   */
  public redeem(code: string): null | RedeemData {
    this.loadData();

    const redeemData = this.data[code] as RedeemData;
    redeemData.status = RedeemStatus.REDEEMED;
    redeemData.redeemedAt = new Date().toISOString();

    this.saveData();

    return redeemData;
  }
}

export default RedeemModel;
