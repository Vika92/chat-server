import express from 'express';
import envVariables from './env-loader';
import * as connection from './database-connection';
import {corsHandler} from './middleware';
import session from 'express-session';

const app = express();

app.use(corsHandler);
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

// routes
import UserController from './models/user-controller';
import bodyParser from "body-parser";
app.use('/auth', UserController);
app.get('', (req, res) => {
  res.send('hello!');
})

app.listen(process.env.APP_PORT, process.env.APP_HOST, function () {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
