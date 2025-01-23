import { USER_AGENTS } from "@constants/user-agents.js";

/**
 * Number of user agents
 *
 * @type {number}
 */
const USER_AGENTS_COUNT: number = USER_AGENTS.length;

/**
 * Last user agent index
 *
 * @type {number}
 */
let lastUserAgentIndex: number = -1;

/**
 * Generate a random user agent
 *
 * @returns {string} The generated user agent
 */
const generateUserAgent = (): string => {
  let index: number = -1;

  do {
    index = Math.floor(Math.random() * USER_AGENTS_COUNT);

    if (index !== lastUserAgentIndex) {
      lastUserAgentIndex = index;
      break;
    }
  } while (true);

  return USER_AGENTS[index];
}

export default generateUserAgent;
