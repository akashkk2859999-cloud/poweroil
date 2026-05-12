import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './modules/auth/auth.router';
import participantsRouter from './modules/participants/participants.router';
import adminRouter from './modules/admin/admin.router';
import settingsRouter from './modules/settings/settings.router';
import exportsRouter from './modules/exports/exports.router';

const app = express();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for easier frontend integration if needed, or configure properly
}));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.nodeEnv });
});

// API Routes
app.use('/api/public/participants', participantsRouter);
app.use('/api/admin/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/admin/exports', exportsRouter);

// Serve Frontend Static Files in Production
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all to serve index.html for React Router
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 for API routes only (fallback)
app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'API Route not found.' });
});

app.use(errorHandler);

export default app;
