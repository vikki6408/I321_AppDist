// routes/router.js
const express = require('express');
const pizzasRouter = require('../../ms-pizza/src/routes/pizzasRoute');
const router = express.Router();

router.use('/pizzas', pizzasRouter);

module.exports = router;
