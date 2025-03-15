import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import { ENV } from '../config/env';

const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    try {
      const { to, subject, body } = job.data;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ENV.EMAIL_USER,
          pass: ENV.EMAIL_PASS,
        },
      });

      await transporter.sendMail({ from: ENV.EMAIL_USER, to, subject, text: body });

      logger.info(`Email sent successfully to ${to} with subject: "${subject}"`);
    } catch (error) {
      logger.error(`Email Job Failed: ${error}`);
      throw error;
    }
  },
  {
    connection: { host: ENV.REDIS_HOST, port: ENV.REDIS_PORT },
    concurrency: 5, // Process up to 5 emails in parallel
  }
);

logger.info('Email worker started');

}
