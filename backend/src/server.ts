import app from './app';
import { config } from './config';
import prisma from './db';

async function startServer() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`PRAGMA journal_mode=WAL`;
    console.log('Database connected (SQLite WAL mode enabled)');
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }

  const server = app.listen(config.port, () => {
    console.log(`PowerOil MasterChef Nigeria API running on http://localhost:${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  });

  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
