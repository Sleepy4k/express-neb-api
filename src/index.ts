/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import app from "@bootstrap/app.js";
import debugLib from "debug";
import http from "http";

/**
 * Get port from environment and store in Express.
 */
const debug = debugLib("express-typescript-neb:server");

/**
 * Create HTTP server.
 */
const server = http.createServer(app as http.RequestListener);

/**
 * Get port from environment and store in Express.
 */
const port: boolean | number | string = (app.get("port") as boolean | number | string) || false;

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  if (port !== false) {
    console.log(`Server running on ${(app.get("host") as string) || "127.0.0.1"}:${port.toString()}`);
  } else {
    console.error("Invalid port value");
  }
});

/**
 * Event listener for HTTP server "error" event.
 */
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + (port as number).toString();

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

/**
 * Event listener for HTTP server "listening" event.
 */
server.on("listening", () => {
  const addr = server.address();
  if (addr === null) return;

  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port.toString()}`;

  debug(`Listening on ${bind}`);
});
