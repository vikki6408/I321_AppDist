// routes/router.js
const express = require('express');
const pizzasRouter = require('../pizza/pizzasRoute');
const ingredientsRouter = require('../ingredient/ingredientsRoute');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
