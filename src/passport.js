const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); // Reemplaza esto con la ubicación real de tu modelo de usuario

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado.' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Credenciales inválidas.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: ' Iv1.925f586ab27baea9',
      clientSecret: 'e3d3be17b004b218a3ec78fb47d675b1ba37fac2',
      callbackURL: 'http://localhost:5500/auth/github/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ githubId: profile.id });
        if (user) {
          return done(null, user);
        } 
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
