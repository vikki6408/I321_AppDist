// routes/router.js
const express = require('express');
const pizzasRouter = require('../routes/pizzasRoute');

const router = express.Router();

router.use('/pizzas', pizzasRouter);

module.exports = router;
