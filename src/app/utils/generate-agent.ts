import { USER_AGENTS } from "@constants/user-agents.js";

/**
 * List of user agents
 *
 * @type {string[]}
 */
const USER_AGENTS_LIST: string[] = Array.isArray(USER_AGENTS) ? USER_AGENTS : [];

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
    index = Math.floor(Math.random() * USER_AGENTS_LIST.length);
  } while (index !== lastUserAgentIndex);

  lastUserAgentIndex = index;

  return USER_AGENTS_LIST[index] ?? USER_AGENTS_LIST[0];
};

export default generateUserAgent;
