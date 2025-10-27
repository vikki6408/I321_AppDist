// src/services/productService.js
const PizzaEntity = require('../entities/PizzaEntity');
const fetch = require('node-fetch');

const PIZZA_INGREDIENT_SERVICE_URL = process.env.PIZZA_INGREDIENT_SERVICE_URL || 'http://localhost:3000';

const PizzaService = {
    async getAll() {
        return PizzaEntity.findAll();
    },

    async getById(id) {
        return PizzaEntity.findById(id);
    },

    async create(pizza) {
        return PizzaEntity.insert(pizza);
    },

    async update(id, pizzaData) {
        const existing = await PizzaEntity.findById(id);
        if (!existing) return null;

        return PizzaEntity.update(id, pizzaData);
    },

    async delete(id) {
        const existing = await PizzaEntity.findById(id);
        if (!existing) return null;

        return PizzaEntity.delete(id);
    },

    async getPizzaWithIngredients(pizzaId) {
        const pizza = await PizzaEntity.findById(pizzaId);
        if (!pizza) throw new Error('Product not found');

        const compositions = await PizzaEntity.findCompositions(pizzaId);

        const ingredients = await Promise.all(
            compositions.map(async (comp) => {
                const res = await fetch(`${PIZZA_INGREDIENT_SERVICE_URL}/api/v1/productItems/${comp.ingredient_id}`);
                if (!res.ok) throw new Error(`PizzaItem ${comp.ingredient_id} not found`);
                const ingredientData = await res.json();
                return { ...ingredientData, quantity: comp.quantity, unit: comp.unit };
            })
        );

        return { ...pizza, ingredients };
    },

    async addComposition(pizzaId, ingredient_id) {
        // Validate remote productItem via API
        const response = await fetch(`${PIZZA_INGREDIENT_SERVICE_URL}/api/v1/ingredients/${ingredient_id}`);
        if (!response.ok) throw new Error('Invalid pizzaIngredient ID');

        return PizzaEntity.insertComposition(pizzaId, ingredient_id);
    },

    async getCompositions(pizzaId) {
        return PizzaEntity.findCompositions(pizzaId);   // retourne le nom de l'ingredient aussi -> construire un dialogue avec car besoin du libelle et de l areponse
    },

    async deleteCompositions(id) {
        const existing = await PizzaEntity.findCompositions(id);
        if (!existing) return null;

        return PizzaEntity.deleteCompositions(id);
    }
};

module.exports = PizzaService;
