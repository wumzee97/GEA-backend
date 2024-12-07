import amqp from 'amqplib';

// Function to establish a connection to RabbitMQ
export async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    console.log('Connected to RabbitMQ');
    return connection;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error; // Propagate the error
  }
}
