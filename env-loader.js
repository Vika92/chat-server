const dotenv = require('dotenv');
process.env.NODE_ENV = 'development';
dotenv.config({path: `.env.${process.env.NODE_ENV}`});
