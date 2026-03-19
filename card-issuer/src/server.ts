import 'reflect-metadata';
import app from './app'
import pino from 'pino';

const logger = pino({
  name: main.name,
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
});

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 card-issue-app running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`❌ Error starting server: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();