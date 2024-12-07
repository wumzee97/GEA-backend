import dotenv from 'dotenv';
//dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });
dotenv.config();

const config = {
  port: process.env.PORT,
  dbUrl: process.env.DB_URL,
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbUser: process.env.DB_USER ?? 'root',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbName: process.env.DB_NAME ?? 'exam',
};

export default config;
