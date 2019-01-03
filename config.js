// read .env files and make environmental variables
require('dotenv').config();

// pull db uri from .env or actual ENV
let DB_URI = process.env.DATABASE_URL || 'postgresql:///image';

// if test environment is active, optimize for performance and convenience
if (process.env.NODE_ENV === 'test') {
  DB_URI = 'postgresql:///image-test';
}

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const SECRET_KEY = process.env.SECRET_KEY || 'test-env-secret';
const SERVER_PORT = process.env.PORT || 3000;
const FOOD_APP_ID = process.env.FOOD_APP_ID;
const FOOD_API = process.env.FOOD_API;

module.exports = {
  DB_URI,
  SECRET_KEY,
  SERVER_PORT,
  CLARIFAI_API_KEY,
  FOOD_APP_ID,
  FOOD_API
};
