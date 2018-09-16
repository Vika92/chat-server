import express from 'express';
import envVariables from './env-loader';
import * as connection from './database-connection';
import {corsHandler} from './middleware';
import session from 'express-session';

const app = express();

app.use(corsHandler);
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

// routes
import UserController from './models/user-controller';
app.use('/auth', UserController);

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
