import express from 'express';
import { securityMiddleware } from './middleware/securityMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import routes from './routes/index.js';

// Exports the app WITHOUT calling listen() so it can be driven by Supertest.
// server.js is the only module that binds a port.
const app = express();

app.disable('x-powered-by');
app.use(securityMiddleware);
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
