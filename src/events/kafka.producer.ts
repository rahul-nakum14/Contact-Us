import { Kafka } from 'kafkajs';
import { ENV } from '../config/env';
import logger from '../utils/logger';

const kafka = new Kafka({
  clientId: 'contact-form-app',
  brokers: [ENV.KAFKA_BROKER],
});

const producer = kafka.producer();

export const sendKafkaMessage = async (topic: string, message: object) => {
  try {
    await producer.connect();
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
    await producer.disconnect();
    logger.info(`Message sent to Kafka topic ${topic}: ${JSON.stringify(message)}`);
  } catch (error) {
    logger.error(`Kafka Producer Error: ${error}`);
  }
};


// import { producer } from "../config/kafka";
// import { logger } from "../utils/logger";

// export class KafkaProducer {
//   static async sendMessage(topic: string, message: object) {
//     try {
//       await producer.send({
//         topic,
//         messages: [{ value: JSON.stringify(message) }],
//       });
//       logger.info(`Message sent to ${topic}: ${JSON.stringify(message)}`);
//     } catch (error) {
//       logger.error(`Kafka Producer Error: ${error}`);
//     }
//   }
// }
