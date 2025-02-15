import { USER_AGENTS } from "@constants/user-agents.js";

/**
 * Number of user agents
 *
 * @type {number}
 */
const USER_AGENTS_COUNT: number = USER_AGENTS.length;

/**
 * Last user agent index
 */
let lastUserAgentIndex = -1;

/**
 * Generate a random user agent
 *
 * @returns {string} The generated user agent
 */
const generateUserAgent = (): string => {
  let index = -1;

  do {
    index = Math.floor(Math.random() * USER_AGENTS_COUNT);

    if (index !== lastUserAgentIndex) {
      lastUserAgentIndex = index;
      break;
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
  } while (true);

  return USER_AGENTS[index];
};

export default generateUserAgent;
