import { RoleType } from "@enums/roleType.js";
import { type UserData } from "@interfaces/userData.js";
import BaseModel from "@modules/baseModel.js";
import { sha256 } from "@utils/encryption.js";

/**
 * The user model class
 *
 * @class UserModel
 * @extends BaseModel
 */
class UserModel extends BaseModel {
  /**
   * The constructor for the UserModel class
   */
  public constructor() {
    super("users.json");

    const defaultUserEmail = "tralalelo-tralala@neb.com";
    const isDefaultUserExists = this.find(defaultUserEmail);
    if (!isDefaultUserExists) this.create(defaultUserEmail, "SkibidiRizzGyatt%20", RoleType.USER);
  }

  /**
   * Get the total number of users
   *
   * @returns {number}
   */
  public count(): number {
    this.loadData();

    return Object.keys(this.data).length;
  }

  /**
   * Create the user data
   *
   * @param {string} email - The email
   * @param {string} password - The password
   *
   * @returns {UserData} The user data
   */
  public create(email: string, password: string, role: RoleType): UserData {
    this.loadData();

    const code = email.split("@")[0];
    const userData: UserData = {
      email,
      password: sha256(password),
      role,
    };

    this.data[code] = userData;
    this.saveData();

    return userData;
  }

  /**
   * Find the user data by email
   *
   * @param {string} email - The email
   *
   * @returns {UserData|null} The user data
   */
  public find(email: string): null | UserData {
    this.loadData();

    const code = email.split("@")[0];
    return this.data[code] as UserData;
  }

  /**
   * Get the user data
   *
   * @returns {UserData[]}
   */
  public get(): UserData[] {
    this.loadData();

    // Parse Record<string, unknown> to UserData[]
    return Object.keys(this.data).map((key) => {
      return this.data[key] as UserData;
    });
  }

  /**
   * Redeem the code
   *
   * @param {string} email - The email
   *
   * @returns {RedeemData|null} The redeem data
   */
  public login(email: string, password: string, role: RoleType = RoleType.USER): null | UserData {
    this.loadData();

    const code = email.split("@")[0];
    const redeemData = this.data[code] as UserData;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!redeemData) return null;

    if (redeemData.email !== email) return null;
    if (redeemData.password !== password) return null;
    if (redeemData.role === RoleType.USER && role == RoleType.ADMIN) return null;

    return redeemData;
  }
}

export default UserModel;
