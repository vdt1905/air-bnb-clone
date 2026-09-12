/**
 * Vercel serverless entry for the API.
 *
 * Vercel turns every file under `api/` into a function. This one re-exports
 * the Express app (which never calls listen()), and `vercel.json` rewrites
 * every `/api/*` request here. Express still sees the ORIGINAL path, so the
 * `/api/health` and `/api/listings/:id` routes match unchanged.
 *
 * Locally nothing imports this file — `server/src/server.js` binds the port.
 */
import app from '../server/src/app.js';

export default app;
