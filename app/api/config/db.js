const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Execute a parameterised SQL query.
 * @param {string} text   - SQL statement
 * @param {Array}  params - Bound parameter values
 */
const query = (text, params) => pool.query(text, params);

module.exports = { query, pool };
