import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@dptickets/common';
import { createTicketRouter } from './Routes/new';
import { showTicketRouter } from './Routes/show';
import { indexTicketRouter } from './Routes/index';
import { updateTicketRouter } from './Routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

// check for any 404
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
