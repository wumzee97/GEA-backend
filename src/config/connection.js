const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  development: {
    username: "root",
    password: "",
    database: "exam",
    host: "localhost",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "",
    database: "exam",
    host: "localhost",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: "",
    database: "exam",
    host: "localhost",
    dialect: "mysql",
  },
};
