import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import ErrorHandler from './middlewares/ErrorHandler';
import { NotFoundError } from './utils/ApiError';
import routes from './routes';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import xss from 'xss-clean';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './services/Swagger';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config';
import { configurePassport } from './config/passport';


const app: Application = express();

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);

//allow cors origin
app.use(cors());

//body parser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// set security HTTP headers
app.use(helmet());

// sanitize request data
app.use(xss());

// Prevent http param pollution
app.use(hpp());

//sanitize inputs
app.use(
  mongoSanitize({
    allowDots: true,
  }),
);

configurePassport()

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// gzip compression
app.use(compression());

//proxy
app.set('trust proxy', true);
app.disable('etag');

//set routes

app.use('/secure/v1', routes);

// Serve Swagger UI
app.use('/swagger/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//handle error
app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError(req.path)));
app.use(ErrorHandler.handle());

//let dbClient: Sequelize | undefined;

// const startDatabase = async () => {
//   try {
//     dbClient = await connection.sync();
//   } catch (error: any) {
//     console.error(`Error occurred: ${error.message}`);
//   }
// };

// Define an async function to connect to MongoDB
async function connectToMongoDB(): Promise<void> {
  const uri: string = `${config.MONGO_URI}`;

  try {
    await mongoose.connect(uri, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });
    console.log('Successfully Connected to MongoDB!');
  } catch (err) {
    console.error('Connection error:', err);
  }
}

// Call the function to connect to the database
connectToMongoDB();
//startDatabase();

// process.on('SIGTERM', () => {
//   console.info('SIGTERM received');
//   if (dbClient) dbClient.close();
// });

export default app;
