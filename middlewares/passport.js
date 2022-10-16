import passport from "passport";
import { Strategy as PPJWT } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { Strategy as PPLocal } from "passport-local";
import googleToken from "passport-google-plus-token";
import facebookToken from "passport-facebook-token";

import User from "../models/User.js";

/* passport-jwt */
passport.use(
  new PPJWT(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);
        if (!user) return done(null, false);
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

/* passport-local */
passport.use(
  new PPLocal(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false);
        /* compare password */
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) return done(null, false);
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

/* passport google */
passport.use(
  new googleToken(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        /* check whether this current database */
        const user = await User.findOne({
          authGoogle: profile.id,
          authType: "google",
        });

        if (user) return done(null, user);
        /* if new account */
        const newUser = new User({
          authType: "google",
          email: profile.emails[0].value,
          authGoogle: profile.id,
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

/* passport facebook */
passport.use(
  new facebookToken(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        /* check whether this current database */
        const user = await User.findOne({
          authFacebook: profile.id,
          authType: "facebook",
        });

        if (user) return done(null, user);
        /* if new account */
        const newUser = new User({
          authType: "facebook",
          email: profile.emails[0].value,
          authFacebook: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName
        });

        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
