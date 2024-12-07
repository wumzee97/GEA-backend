import 'reflect-metadata';
import app from './app';
import http from 'http';
import Config from './config/DbConfig';
import ErrorHandler from './middlewares/ErrorHandler';

const PORT = Config.port || 61529;
let server: http.Server;

const startServer = async () => {
  try {
    server = app.listen(PORT, (): void => {
      console.log(`Connected successfully on port ${PORT}`);
    });
  } catch (error: any) {
    console.error(`Error occurred: ${error.message}`);
  }
};

startServer();
ErrorHandler.initializeUnhandledException();

// process.on('SIGTERM', () => {
//   console.info('SIGTERM received');
//   if (server) server.close();
// });
