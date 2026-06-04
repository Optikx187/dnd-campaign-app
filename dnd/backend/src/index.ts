import express, { Request, Response, NextFunction } from 'express';
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

app.use(cors());
app.use(express.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET || 'dnd-campaign-secret',
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

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
