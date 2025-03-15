import { Kafka } from 'kafkajs';
import { ENV } from '../config/env';
import logger from '../utils/logger';
import { addEmailToQueue } from '../queues/email.queue';

const kafka = new Kafka({
  clientId: 'contact-form-app',
  brokers: [ENV.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'contact-form-group' });

export const consumeKafkaMessages = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'form-submissions', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;
      const data = JSON.parse(message.value.toString());
      logger.info(`Kafka message received: ${JSON.stringify(data)}`);

      if (topic === 'form-submissions') {
        await addEmailToQueue({
          to: data.email,
          subject: 'New Form Submission',
          body: `You have received a new submission.`,
        });
      }
    },
  });
};


// import { consumer } from "../config/kafka";
// import { logger } from "../utils/logger";
// import { EmailJob } from "../jobs/email.job";

// export class KafkaConsumer {
//   static async start() {
//     await consumer.subscribe({ topic: "form-submission", fromBeginning: false });

//     await consumer.run({
//       eachMessage: async ({ topic, message }) => {
//         if (!message.value) return;

//         const data = JSON.parse(message.value.toString());
//         logger.info(`Received message from ${topic}: ${JSON.stringify(data)}`);

//         if (topic === "form-submission") {
//           await EmailJob.processEmail(data);
//         }
//       },
//     });
//   }
// }
