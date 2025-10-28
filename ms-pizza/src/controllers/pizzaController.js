// controllers/pizzaController.js
/*const { validationResult } = require('express-validator');
const Pizza = require('../entities/PizzaEntity');
const { validateIngredients } = require("../../../ms-ingredient/src/controllers/ingredientController");*/

const PizzaService = require('../services/pizzaService');

const PizzaController = {
    // GET /api/v1/pizzas
    async findAll(req, res) {
        try {
            const pizzas = await PizzaService.getAll();
            res.json(pizzas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id
    async findOne(req, res) {
        try {
            const pizza = await PizzaService.getById(req.params.id);
            if (!pizza) return res.status(404).json({ error: 'Product not found' });
            res.json(pizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // POST /api/v1/products
    async create(req, res) {
        try {
            const pizza = await PizzaService.create(req.body);
            res.status(201).json(pizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/v1/products/:id/
    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedPizza = await PizzaService.update(id, req.body);
            if (!updatedPizza) return res.status(404).json({ error: 'Product not found' });
            res.json(updatedPizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/v1/products/:id/
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PizzaService.delete(id);
            if (!deleted) return res.status(404).json({ error: 'Pizza not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/full
    // Returns pizza + list of items
    async getPizzaWithIngredients(req, res) {
        try {
            const { id } = req.params;
            const pizza = await PizzaService.getPizzaWithIngredients(id);
            res.json(pizza);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // POST /api/v1/products/:id/compositions
    async addComposition(req, res) {
        try {
            const { id } = req.params;
            const { ingredient_id, quantity, unit } = req.body;
            const composition = await PizzaService.addComposition(id, ingredient_id, quantity, unit);
            res.status(201).json(composition);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async getCompositions(req, res) {
        try {
            const { id } = req.params;
            const compositions = await PizzaService.getCompositions(id);
            res.json(compositions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async putCompositions(req, res) {
        try {
            const { id } = req.params; // pizza id
            const { oldIngredientId, newIngredientId } = req.body;

            console.log("➡️ Updating composition for pizza:", id, { oldIngredientId, newIngredientId });

            const updated = await PizzaService.upsertComposition(id, oldIngredientId, newIngredientId);

            if (!updated) return res.status(404).json({ error: 'Pizza not found' });

            res.json(updated);
        } catch (error) {
            console.error("❌ ERROR in putCompositions:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async deleteCompositions(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PizzaService.deleteCompositions(id);
            if (!deleted) return res.status(404).json({ error: 'Composition not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PizzaController;