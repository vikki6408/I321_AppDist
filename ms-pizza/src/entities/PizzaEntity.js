// entities/pizza.js
const db = require('../config/database');

const Pizza = {
    findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pizzas', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pizzas WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    insert(pizza) {
        const { name, imageUrl, price } = pizza;
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO pizzas (name, imageUrl, price) VALUES (?, ?, ?)`,
                [name, imageUrl, price],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...pizza });
                }
            );
        });
    },

    update(id, pizza) {
        const { name, imageUrl, price } = pizza;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE pizzas SET name = ?, imageUrl = ?, price = ?, updated_at = datetime('now') WHERE id = ?`,
                [name, imageUrl, price, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...pizza });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM pizzas WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },

    findCompositions(pizzaId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM pizza_compositions WHERE pizza_id = ?',
                [pizzaId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    insertComposition(pizzaId, ingredientId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO pizza_compositions (pizza_id, ingredient_id)
         VALUES (?, ?)`,
                [pizzaId, ingredientId],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, pizzaId, ingredientId});
                }
            );
        });
    },

    deleteCompositions(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM pizza_compositions WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },
};

module.exports = Pizza;



/*class Pizza {
    static create({ name, ingredients, imageUrl, price }) {
        const sql = `INSERT INTO pizzas (name, ingredients, imageUrl, price, created_at, updated_at)
                     VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`;
        const params = [name, ingredients, imageUrl || null, price];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                Pizza.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }

    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }


    static update(id, { name, ingredients, imageUrl, price }) {
        const sql = `
            UPDATE pizzas
            SET name = COALESCE(?, name),
                ingredients = COALESCE(?, ingredients),
                imageUrl = COALESCE(?, imageUrl),
                price = COALESCE(?, price),
                updated_at = datetime('now')
            WHERE id = ?
        `;
        const params = [name, ingredients, imageUrl, price, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Pizza.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = Pizza;*/
