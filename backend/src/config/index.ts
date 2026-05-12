import dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
  campaignBaseUrl: process.env.CAMPAIGN_BASE_URL || 'http://localhost:5173',
  rateLimitWindowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};
