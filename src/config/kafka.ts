import { Kafka } from "kafkajs";
import { ENV } from "./env";

export const kafka = new Kafka({
  clientId: "contact-us-service",
  brokers: [ENV.KAFKA_BROKER]
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "contact-us-group" });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
  console.log("✅ Kafka connected successfully!");
};
