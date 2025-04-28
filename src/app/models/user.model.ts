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

    this.initialize().catch((error: unknown) => {
      console.error("Error initializing UserModel:", error);
    });
  }

  /**
   * Create the user data
   *
   * @param {string} email - The email
   * @param {string} password - The password
   *
   * @returns {UserData} The user data
   */
  public async create(email: string, password: string, role: RoleType): Promise<UserData> {
    const userData: UserData = {
      email,
      password: sha256(password),
      role,
    };

    await this.save(email.split("@")[0], userData);

    return userData;
  }

  /**
   * Find the user data by email
   *
   * @param {string} email - The email
   *
   * @returns {undefined|UserData} The user data
   */
  public async find(email: string): Promise<undefined | UserData> {
    return await super.find(email.split("@")[0]);
  }

  /**
   * Initializes the user class
   */
  public async initialize(): Promise<void> {
    if (appConfig.env === "prod" || appConfig.env === "production") return;

    const defaultUserEmail = "tralalelo-tralala@neb.com";
    const isDefaultUserExists = await this.find(defaultUserEmail);
    if (!isDefaultUserExists) await this.create(defaultUserEmail, "SkibidiRizzGyatt%20", RoleType.USER);
  }

  /**
   * Redeem the code
   *
   * @param {string} email - The email
   *
   * @returns {RedeemData|null} The redeem data
   */
  public async login(email: string, password: string, role: RoleType = RoleType.USER): Promise<null | UserData> {
    const redeemData = await this.find(email.split("@")[0]);
    if (!redeemData) return null;

    if (redeemData.email !== email) return null;
    if (redeemData.password !== password) return null;
    if (redeemData.role === RoleType.USER && role == RoleType.ADMIN) return null;

    return redeemData;
  }
}

export default UserModel;
