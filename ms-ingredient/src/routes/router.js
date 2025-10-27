// routes/router.js
const express = require('express');
const ingredientsRouter = require('./ingredientsRoute');

const router = express.Router();

router.use('/ingredients', ingredientsRouter);

module.exports = router;
