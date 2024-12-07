// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Quizzey API Engine', // Title of the API
    version: '1.0.0', // Version of the API
    description: 'Quizzey API documentation', // Description of your API
  },
  servers: [
    {
      url: 'http://localhost:8080', // URL of your API
      description: 'Generated server URL',
    },
  ],

  // Add other tags as needed
  tags: [
    {
      name: 'Users',
      description: 'API for users in the system',
    },
    {
      name: 'Products',
      description: 'API for products management',
    },
  ],
};

// Options for the swagger docs
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to your route files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
