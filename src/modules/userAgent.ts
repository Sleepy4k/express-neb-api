import { USER_AGENTS } from "@constants/user-agents.js";

class UserAgentGenerator {
  #lastGeneratedAgent: null | string = null;
  #userAgentList: string[];

  /**
   * UserAgentGenerator constructor.
   *
   * @throws {Error} If the user agent list is not an array or is empty.
   */
  public constructor() {
    const userAgentList = Array.isArray(USER_AGENTS) ? USER_AGENTS : [];

    if (!Array.isArray(userAgentList) || userAgentList.length === 0) {
      throw new Error("User agent list must be a non-empty array.");
    }

    this.#userAgentList = [...userAgentList];
  }

  /**
   * Generates a random user agent string from the list.
   *
   * @returns {string|null} A random user agent string or null if the list is empty.
   */
  public generate(): null | string {
    if (this.#userAgentList.length === 0) {
      return null;
    }

    let randomIndex: number;
    let newAgent: string;

    do {
      randomIndex = Math.floor(Math.random() * this.#userAgentList.length);
      newAgent = this.#userAgentList[randomIndex];
    } while (newAgent === this.#lastGeneratedAgent);

    this.#lastGeneratedAgent = newAgent;

    return newAgent;
  }
}

export default UserAgentGenerator;
