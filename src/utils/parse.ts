/**
 * Normalize a port into a number, string, or false.
 *
 * @param {any} val - The port value
 *
 * @returns {any} The normalized port value
 */
function normalizePort(val: any): any {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

/**
 * Parse the hostname
 *
 * @param {string|null} host - The hostname
 *
 * @returns {string} The parsed hostname
 */
function parseHostname(host?: string|null): string {
  const regex = new RegExp('^(http|https)://', 'i');

  if (!host) return 'https://localhost';

  return regex.test(host) ? host : 'https://' + host;
}

export {
  normalizePort,
  parseHostname
};