import app from '@/main.js';
import debugLib from 'debug';
import http from 'http';

/**
 * Get port from environment and store in Express.
 */
const debug = debugLib('express-typescript-neb:server');

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
const port = app.get('port');

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`Server running on ${app.get('host')}:${port}`));
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
  case 'EACCES':
    console.error(`${bind} requires elevated privileges`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(`${bind} is already in use`);
    process.exit(1);
    break;
  default:
    throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;

  debug(`Listening on ${bind}`);
}
