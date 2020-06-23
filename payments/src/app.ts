import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@dptickets/common';
import { createChargeRouter } from './routes/new';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);
app.use(currentUser);
app.use(createChargeRouter);
// check for any 404
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
