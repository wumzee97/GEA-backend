// @ts-nocheck
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Parent from '../models/parents.model';
import Tutor from '../models/tutors.model';
import { v4 as uuidv4 } from 'uuid';
import { IssueTutorSignature, SignSignature } from '../utils';

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  passport.use(
    'google-signup',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true, // Allow access to the req object
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const userType = req.query.state as string; // Retrieve user type from state
          const [firstName, ...lastNameParts] = profile.displayName.split(' ');
          const lastName = lastNameParts.join(' ');
          console.log('First name:', firstName, 'Last name:', lastName);

          let user;
          if (userType === 'parent') {
            user = await Parent.findOne({ googleId: profile.id });
            if (user) {
              return done(null, false);
            }
            console.log('Existing Parent user:', user);
            if (!user) {
              user = await Parent.create({
                googleId: profile.id,
                firstName,
                lastName,
                token: uuidv4(),
                email: profile.emails?.[0].value,
                avatar: profile.photos?.[0].value,
              });
              console.log('New Parent user created:', user);
            }
          } else if (userType === 'tutor') {
            user = await Tutor.findOne({ googleId: profile.id });
            console.log('Existing Tutor user:', user);
            if (user) {
              return done(null, false);
            }
            if (!user) {
              user = await Tutor.create({
                googleId: profile.id,
                firstName,
                lastName,
                email: profile.emails?.[0].value,
                avatar: profile.photos?.[0].value,
              });
              console.log('New Tutor user created:', user);
            }
          }
          user.type = userType;
          return done(null, user);
        } catch (err) {
          console.error('Error in GoogleStrategy:', err);
          return done(err, null);
        }
      },
    ),
  );

  passport.use(
    'google-login', // You can name your strategy
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL_LOGIN,
        passReqToCallback: true, // Allow access to the req object
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const userType = req.query.state as string; // Retrieve user type from state
          const [firstName, ...lastNameParts] = profile.displayName.split(' ');
          const lastName = lastNameParts.join(' ');

          let user;
          let token;
          if (userType === 'parent') {
            // Check if user exists, if yes return it
            user = await Parent.findOne({ googleId: profile.id });
            if (!user) {
              return done(null, false, { type: userType });
            }

            token = await SignSignature(user);
          } else if (userType === 'tutor') {
            user = await Tutor.findOne({ googleId: profile.id });
            if (!user) {
              return done(null, false, { type: userType });
            }

            token = await IssueTutorSignature(user);
          }

          user.type = userType;
          // If the user exists, pass the user object to the done function

          return done(null, user, token?.accessToken, token?.refreshToken);
        } catch (err) {
          console.error('Error in Google login strategy:', err);
          return done(err, null);
        }
      },
    ),
  );
};
