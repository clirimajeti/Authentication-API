const Pool = require('pg').Pool
const pool = new Pool({
  user: 'cajeti',
  host: 'localhost',
  database: 'cake_api',
  password: 'admin1234',
  port: 5432,
})

module.exports = {
    query: (text, params) => pool.query(text, params),
  }