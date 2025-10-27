// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();


const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'pizzas.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Enable foreign key enforcement for local integrity (only within this DB)
db.run('PRAGMA foreign_keys = ON;');

// Initialize ingredients table if not exists
const initSql =`
    CREATE TABLE IF NOT EXISTS pizzas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        imageUrl TEXT,
        price REAL NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
    );
    
    -- No real FK to productItems here (it’s managed by API validation)
    CREATE TABLE IF NOT EXISTS pizza_compositions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pizza_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE
    );
`;

db.serialize(() => {
    db.exec(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
        console.log('Tables ensured.');
    });

    // Seed products only if empty
    db.get('SELECT COUNT(*) AS count FROM pizzas', (err, row) => {
        if (err) {
            console.error('Error checking product count', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding test data (pizzas)...');

            const pizzaData = [
                ['Margherita', 13.0],
                ['Romana', 15.0],
            ];

            const insertPizzaSql = `INSERT INTO pizzas (name, imageUrl, price)
                                VALUES (?, ?, ?)`;
            const pizzaStmt = db.prepare(insertPizzaSql);

            pizzaData.forEach(([name, imageUrl, price]) =>
                pizzaStmt.run(name, imageUrl, price)
            );

            pizzaStmt.finalize(() => console.log('Seed data inserted.'));
        } else {
            console.log(`Database already contains ${row.count} products — skipping seed.`);
        }
    });

    // Seed compositions only if empty
    db.get('SELECT COUNT(*) AS count FROM pizza_compositions', (err, row) => {
        if (err) {
            console.error('Error checking pizza_compositions', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding pizza_compositions...');
            const stmt = db.prepare(`
            INSERT INTO pizza_compositions (pizza_id, ingredient_id)
            VALUES (?, ?)
        `);

            stmt.run(1, 1);
            stmt.run(1, 2);

            stmt.run(2, 1);
            stmt.run(2, 2);
            stmt.run(2, 3);

            stmt.finalize(() => console.log('pizza_compositions seeded.'));
        }
    });
});

module.exports = db;
