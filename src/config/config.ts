// config/config.ts
import { SequelizeOptions } from 'sequelize-typescript';

const config: { [key: string]: SequelizeOptions } = {
  development: {
    username: 'root',
    password: '',
    database: 'exam',
    host: 'localhost',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: '',
    database: 'exam',
    host: 'localhost',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: '',
    database: 'exam',
    host: 'localhost',
    dialect: 'mysql',
  },
};

export default config;
