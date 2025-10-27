// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaController = require('../controllers/pizzaController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PizzaComposition:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         pizza_id:
 *           type: integer
 *           example: 1
 *         ingredient_id:
 *           type: integer
 *           example: 2
 */

/**
 * @openapi
 * /pizzas:
 *   get:
 *     summary: Retrieve a list of pizzas
 *     responses:
 *       200:
 *         description: A list of pizza
 *   post:
 *     summary: Create a new pizza
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
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pizza item
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /pizzas/{id}:
 *   get:
 *     summary: Get a pizza by ID
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
 *         description: Pizza not found
 *   put:
 *     summary: Update a pizza by ID
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
 *               imageUrl:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizzas not found
 *   delete:
 *     summary: Delete a Pizza by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       404:
 *         description: Pizza not found
 */

/**
 * @openapi
 * /pizzas/{id}/compositions:
 *   get:
 *     summary: Get all composition items for a pizza
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Pizza ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Array of product compositions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PizzaComposition'
 *       '404':
 *         description: Pizza not found
 *
 *   post:
 *     summary: Add a composition ingredient to a pizza
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to which the composition is added
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredient_id:
 *                 type: integer
 *                 description: The ID of the pizza ingredient to associate
 *                 example: 2
 *     responses:
 *       201:
 *         description: Composition successfully added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PizzaComposition'
 *       400:
 *         description: Validation error or missing data
 *       404:
 *         description: Pizza or ingredient not found
 *
 *
 *   delete:
 *     summary: Delete all composition ingredients for a specific pizza
 *     tags: [Compositions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product whose compositions should be deleted
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: All compositions successfully deleted
 *       404:
 *         description: Pizza or composition not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

const createAndUpdateValidationsCompositions = [
    body('pizza_id').isString().notEmpty().withMessage('pizza id is required'),
    body('ingredient_id').isString().notEmpty().withMessage('ingredient id is required'),
];

// ---------------- Pizza ----------------
router.get('/', pizzaController.findAll);
router.post('/', createAndUpdateValidations, pizzaController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaController.delete);
router.get('/:id/full', [param('id').isInt()], pizzaController.getPizzaWithIngredients);


// ---------------- Composition ----------------
router.get('/:id/compositions',[param('id').isInt()], pizzaController.getCompositions);
router.post('/:id/compositions', createAndUpdateValidationsCompositions, pizzaController.addComposition);
router.delete('/:id/compositions', [param('id').isInt()], pizzaController.deleteCompositions);


module.exports = router;
