import { Router } from 'express';
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = Router();

// Google OAuth Strategy - Temporarily disabled due to module resolution issues
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID || '',
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//       callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
//     },
//     async (accessToken: any, refreshToken: any, profile: any, done: any) => {
//       try {
//         // In production, save/find user in database
//         const user = {
//           id: profile.id,
//           username: profile.displayName,
//           email: profile.emails?.[0]?.value || null,
//           googleId: profile.id,
//           createdAt: new Date().toISOString(),
//         };
//         return done(null, user);
//       } catch (error) {
//         return done(error as Error, undefined);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done: any) => {
//   done(null, user);
// });

// passport.deserializeUser((user: any, done: any) => {
//   done(null, user);
// });

// Google OAuth Routes - Temporarily disabled
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   (req: any, res) => {
//     // Successful authentication
//     const user = req.user as any;
//     res.json({ user, message: 'Google login successful' });
//   }
// );

// Simple demo authentication - in production, use proper password hashing and JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Demo: Accept any username/password for now
    // In production, verify against database with bcrypt
    const user = {
      id: 'demo-user-id',
      username,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Demo: Create user without database
    // In production, save to database with bcrypt
    const user = {
      id: 'new-user-id',
      username,
      email: email || null,
      createdAt: new Date().toISOString(),
    };

    res.json({ user, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
