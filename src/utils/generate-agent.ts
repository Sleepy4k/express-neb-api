import { USER_AGENTS } from "@constants/user-agents.js";

/**
 * Number of user agents
 */
const USER_AGENTS_COUNT = USER_AGENTS.length;

/**
 * Last user agent index
 */
let lastUserAgentIndex = -1;

/**
 * Generate a random user agent
 */
export function generateUserAgent(): string {
  let index = -1;

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
