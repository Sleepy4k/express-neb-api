import { type RoleType } from "@enums/roleType.js";

/**
 * User Data interface for data type User Data
 *
 * @interface UserData
 *
 */
interface UserData {
  email: string;
  password: string;
  role: RoleType;
}

export type { UserData };
