// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzas API',
            version: '1.0.0',
            description: 'RESTful API for pizza management (SQLite, Express).'
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Local dev server' }
        ]
    },
    apis: ['./src/routes/*.js', './src/pizza/*.js'] // pick up JSDoc in routes/controllers

};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
