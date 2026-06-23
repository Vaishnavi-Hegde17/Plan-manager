import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import subscriptionRoutes from './routes/subscription';
import adminRoutes from './routes/admin';
import { initCronJobs } from './cron/scheduler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/admin', adminRoutes);

// Initialize daily cron jobs
initCronJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
