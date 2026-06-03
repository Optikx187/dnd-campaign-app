import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// const passport = require('passport');
// const session = require('express-session');
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
