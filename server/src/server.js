import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`[server] listening on port ${env.port} (${env.nodeEnv})`);
});

const shutdown = (signal) => {
  console.log(`[server] ${signal} received, closing`);
  server.close(() => process.exit(0));
  // Do not hang forever on in-flight connections.
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// After an uncaught exception the process state is undefined — log and exit so
// a supervisor restarts cleanly rather than serving from a corrupted process.
process.on('uncaughtException', (error) => {
  console.error('[fatal] uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('[fatal] unhandled rejection', reason);
  process.exit(1);
});
