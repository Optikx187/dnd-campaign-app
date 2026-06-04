import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import passport from 'passport';
// import session from 'express-session';
import aiRoutes from './routes/ai';
import rulesRoutes from './routes/rules';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaign';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:80', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
// app.use(session({
//   secret: process.env.SESSION_SECRET ?? (() => { throw new Error('SESSION_SECRET env var is required'); })(),
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/ai', aiRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/campaign', campaignRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'D&D Campaign API Server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
