// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizza Ingredients API',
            version: '1.0.0',
            description: 'RESTful API for ingredient management (SQLite, Express).'
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local development server'
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'] // pick up JSDoc in routes/controllers

};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
