import express from 'express';
import { securityMiddleware } from './middleware/securityMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import routes from './routes/index.js';
import { env } from './config/env.js';

// Exports the app WITHOUT calling listen() so it can be driven by Supertest.
// server.js is the only module that binds a port.
const app = express();

app.disable('x-powered-by');

// Off by default. Enabling it makes Express trust X-Forwarded-For for req.ip,
// which the rate limiter keys on — so trusting it when NOT behind a proxy lets
// any client forge an IP and sidestep the limit. Set TRUST_PROXY only when a
// real proxy sits in front.
app.set('trust proxy', env.trustProxy);

app.use(securityMiddleware);
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
