import { appConfig } from "@config/app.config.js";
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
class UserModel extends BaseModel<UserData> {
  /**
   * The constructor for the UserModel class
   */
  public constructor() {
    super("users.json");

    if (appConfig.env === "prod" || appConfig.env === "production") return;

    const defaultUserEmail = "tralalelo-tralala@neb.com";
    const isDefaultUserExists = this.find(defaultUserEmail);
    if (!isDefaultUserExists) this.create(defaultUserEmail, "SkibidiRizzGyatt%20", RoleType.USER);
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
    const userData: UserData = {
      email,
      password: sha256(password),
      role,
    };

    this.save(email.split("@")[0], userData);

    return userData;
  }

  /**
   * Find the user data by email
   *
   * @param {string} email - The email
   *
   * @returns {undefined|UserData} The user data
   */
  public find(email: string): undefined | UserData {
    return super.find(email.split("@")[0]);
  }

  /**
   * Redeem the code
   *
   * @param {string} email - The email
   *
   * @returns {RedeemData|null} The redeem data
   */
  public login(email: string, password: string, role: RoleType = RoleType.USER): null | UserData {
    const redeemData = this.find(email.split("@")[0]);
    if (!redeemData) return null;

    if (redeemData.email !== email) return null;
    if (redeemData.password !== password) return null;
    if (redeemData.role === RoleType.USER && role == RoleType.ADMIN) return null;

    return redeemData;
  }
}

export default UserModel;
