import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@dptickets/common';
import { newOrderRouter } from './Routes/new';
import { showOrderRouter } from './Routes/show';
import { indexOrdersRouter } from './Routes/index';
import { deleteOrderRouter } from './Routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrdersRouter);
app.use(deleteOrderRouter);

// check for any 404
app.all('*', async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
