import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './user';

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// GET
router.get('/me', function(req, res) {
  jwt.verify(req.session.token, 'secret', function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    User.findById(decoded.id, (err, user) => {
      if (err) {
        res.status(500).send({ auth: false, message: 'Failed to find user.' });
        return;
      }
       res.status(200).send(user);
    });

  });
});
router.get('/logout', function(req, res) {
  jwt.verify(req.session.token, 'secret', function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    req.session.destroy();
    res.status(200).send({auth: true, message: 'Session destroyed'});
  });
});

// POST
router.post('/register', bodyParser.json(), function(req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.");
      const token = jwt.sign({id: user._id}, 'secret', {expiresIn: 86400});
      req.session.token = token;
      res.status(200).send({auth: true, token: token});
    });
});

export default router;
