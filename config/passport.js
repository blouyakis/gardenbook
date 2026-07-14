import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserById } from "../models/users.js";

const strategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        // Case 2. User not found or password incorrect
        return done(null, false, { message: "User or password incorrect" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        // Case 2. User not found or password incorrect
        return done(null, false, { message: "User or password incorrect" });
      }

      delete user.passwordHash;
      // Case 3. User found and password correct
      return done(null, user);
    } catch (error) {
      // Case 1. There is an error
      done(error);
    }
  }
);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    if (user) delete user.passwordHash;
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
