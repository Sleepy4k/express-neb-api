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

function parseHostname(host?: string|null): string {
  const regex = new RegExp('^(http|https)://', 'i');

  if (!host) return 'https://localhost';

  return regex.test(host) ? host : 'https://' + host;
}

export {
  normalizePort,
  parseHostname
};