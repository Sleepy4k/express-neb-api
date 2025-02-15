import app from "@/main.js";
import debugLib from "debug";
import http from "http";

/**
 * Get port from environment and store in Express.
 */
const debug = debugLib("express-typescript-neb:server");

/**
 * Create HTTP server.
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const server = http.createServer(app);

/**
 * Get port from environment and store in Express.
 */
const port: false | number | string = app.get("port") as false | number | string;

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => {
  if (port !== false) {
    console.log(`Server running on ${app.get("host") as string}:${port.toString()}`);
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
