import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';
import rulesRoutes from './routes/rules';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/ai', aiRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'D&D Campaign API Server' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
