import { Sequelize } from 'sequelize-typescript';
import config from '../config/DbConfig';
import path from 'path';
import { User } from '../models/User';

const connection = new Sequelize({
  dialect: 'mysql',
  host: config.dbHost,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  //logging: true,
  logging: false,
  //models: [path.join(__dirname, '..', 'models')],
  models: [User],
});

connection
  .authenticate()
  .then(() => console.log('Connection established successfully.'))
  .catch((error) => console.error('Unable to connect to the database:', error));

export default connection;
