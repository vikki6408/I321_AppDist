// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientController = require('../controllers/ingredientController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/ingredients:
 *   get:
 *     summary: Retrieve a list of ingredients
 *     responses:
 *       200:
 *         description: A list of ingredients
 *   post:
 *     summary: Create a new ingredient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: ingredient created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/v1/ingredients/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single pizza
 *       404:
 *         description: pizza not found
 *   put:
 *     summary: Update an ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: pizza not found
 *   delete:
 *     summary: Delete an ingredient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: pizza deleted
 *       404:
 *         description: pizza not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

router.get('/', ingredientController.findAll);
router.post('/', createAndUpdateValidations, ingredientController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.delete);

module.exports = router;
