import dotenv from 'dotenv';
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'production', // Changed default to production for Railway
  port: parseInt(process.env.PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'https://poweroil-masterchef.railway.app', // Using a placeholder that looks correct for Railway
  jwtSecret: process.env.JWT_SECRET || 'poweroil_masterchef_nigeria_jwt_secret_replace_in_production_2024',
  campaignBaseUrl: process.env.CAMPAIGN_BASE_URL || 'https://poweroil-masterchef.railway.app',
  rateLimitWindowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};
