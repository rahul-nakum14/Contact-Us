import { Queue } from 'bullmq';
import { ENV } from '../config/env';
import logger from '../utils/logger';

export const EmailQueue = new Queue('email-queue', {
  connection: {
    url: ENV.REDIS_URL,
  },
});

export const addEmailToQueue = async (emailData: { to: string; subject: string; body: string }) => {
  try {
    await EmailQueue.add('sendEmail', emailData, { attempts: 5, backoff: { type: 'exponential', delay: 5000 } });
    logger.info(`Added email job to queue: ${JSON.stringify(emailData)}`);
  } catch (error) {
    logger.error(`Failed to add email job to queue: ${error}`);
  }
};
