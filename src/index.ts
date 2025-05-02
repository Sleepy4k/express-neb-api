import App from "@bootstrap/app.js";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get the directory name of the current module
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create Express server
 */
const app = new App(__dirname).instance;

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
server.listen(port);

/**
 * Event listener for HTTP server "listening" event.
 */
server.on("listening", () => {
  const addr = server.address();
  if (!addr) return;

  const binded = typeof addr === "string" ? addr : `${app.get("host") as string}:${addr.port.toString()}`;
  console.log(`Server started on ${binded}`);
});

/**
 * Event listener for HTTP server "error" event.
 */
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port.toString()}`;

  if (error.code === "EACCES") {
    console.error(`${bind} requires elevated privileges`);
    process.exit(1);
  } else if (error.code === "EADDRINUSE") {
    console.error(`${bind} is already in use`);
    process.exit(1);
  } else {
    throw error;
  }
});
