import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.router';
import participantsRouter from './modules/participants/participants.router';
import adminRouter from './modules/admin/admin.router';
import settingsRouter from './modules/settings/settings.router';
import exportsRouter from './modules/exports/exports.router';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.nodeEnv });
});

// Public APIs
app.use('/api/public/participants', participantsRouter);

// Admin APIs
app.use('/api/admin/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/admin/exports', exportsRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found.' });
});

app.use(errorHandler);

export default app;
