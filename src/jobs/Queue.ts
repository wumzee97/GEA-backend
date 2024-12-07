import { connectToRabbitMQ } from '../services/RabbitMQ';
const QUEUE_NAME = 'job_queue';
const EXCHANGE_NAME = 'delayed_exchange';
const DELAYED_EXCHANGE_TYPE = 'x-delayed-message';

// Function to send jobs from the RabbitMQ queue
export async function sendJobWithDelay(message: string, delay: number) {
  try {
    const connection = await connectToRabbitMQ();
    const channel = await connection.createChannel();

    // Declare a delayed exchange
    await channel.assertExchange(EXCHANGE_NAME, DELAYED_EXCHANGE_TYPE, {
      durable: true,
      arguments: { 'x-delayed-type': 'direct' },
    });

    // Bind the exchange to the queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, '');

    // Send the job with a delay
    await channel.publish(EXCHANGE_NAME, '', Buffer.from(message), {
      headers: { 'x-delay': delay },
      persistent: true,
    });

    console.log(`Job sent with ${delay}ms delay: ${message}`);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Error sending delayed job:', error);
  }
}

// Function to consume jobs from the RabbitMQ queue
export async function consumeJobs() {
  try {
    const connection = await connectToRabbitMQ();
    const channel = await connection.createChannel();

    // Declare a queue (in case it doesn't exist)
    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    // Prefetch 1 message at a time (for fair dispatching)
    await channel.prefetch(1);

    console.log(`Waiting for jobs in queue: ${QUEUE_NAME}`);

    // Consume messages
    channel.consume(QUEUE_NAME, async (message) => {
      if (message !== null) {
        console.log(message);

        const job = message.content.toString();
        console.log(`Received job: ${job}`);

        // Simulate processing time (2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log(`Processed job: ${job}`);

        // Acknowledge the job has been processed
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error('Error consuming jobs:', error);
  }
}

// var type = {
//     email: email,
//     password: password
//   };
// Example usage: Schedule a job to be processed after 10 seconds (10000ms)
//sendJobWithDelay(type.toString(), 10000);
//consume jobs
//consumeJobs();
