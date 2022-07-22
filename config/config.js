require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DEV_USERNAME,
    "password": process.env.DEV_PASSWORD,
    "database": process.env.DEV_DATABASE,
    "host": process.env.DEV_HOST,
    "dialect": process.env.DEV_DIALECT
  },
  "test": {
    "username": process.env.TEST_USERNAME,
    "password": process.env._TEST_PASSWORD,
    "database": process.env.TEST_DATABASE,
    "host": process.env.TEST_HOST,
    "dialect": process.env.TEST_DIALECT
  },
  "production": {
    "username": process.env.PROD_USERNAME,
    "password": process.env._PROD_PASSWORD,
    "database": process.env.PROD_DATABASE,
    "host": process.env.PROD_HOST,
    "dialect": process.env.PROD_DIALECT
  }
}
