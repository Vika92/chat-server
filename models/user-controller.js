import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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
router.post('/register', function(req, res) {
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

router.post('/github/access_token', function(req, res) {
  console.log(52);
  axios({
    // params: {
    //   client_id: process.env.GITHUB_CLIENT_ID,
    //   client_secret: process.env.GITHUB_CLIENT_SECRET,
    //   code: req.body.code,
    //   redirect_uri: process.env.LINKEDIN_REDIRECT_URI
    // },
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=
    ${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.body.code}`,
    headers: {
      accept: 'application/json'
    }
  }).then((response) => {
    const accessToken = response.data.access_token;
    console.log(62, accessToken);
    // res.status(200).send();
    // axios.get('https://api.github.com/user', {
    //   headers: {
    //     Authorization: 'token ' + accessToken
    //   }
    // }).then((response) => {
    //   console.log(76, response.data);
    // }).catch(err => {
    //   console.log(69, err.response.data);
    // })
    // res.redirect(`/welcome.html?access_token=${accessToken}`)
  }).catch(err => {

    console.log(81, err.response);
  })
});

router.post('/linkedin/access_token', function(req, res) {
  console.log(85);
  // axios.get(`https://www.linkedin.com/oauth/v2/accessToken?client_id=${process.env.LINKEDIN_CLIENT_ID}&grant_type=authorization_code&code=${req.body.code}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}`)
  axios.get('https://www.linkedin.com/oauth/v2/accessToken', {
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      code: req.body.code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI
    }
  }).then((response) => {
      const accessToken = response.data.access_token;
      console.log(99, accessToken);
      axios.get('https://api.linkedin.com/v1/people/~:(first-name,email-address)?format=json', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(response => {
        console.log(105, response.data)
      }).catch((err) => {
        console.log(107);
      })
      // res.status(200).send();
    })
    .catch((error) => {
      console.log(101);
    });
});

export default router;
