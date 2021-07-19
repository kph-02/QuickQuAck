const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "admin", // change when done
    host: "localhost",
    port: 5432,
    database: "main"
});

module.exports = pool;