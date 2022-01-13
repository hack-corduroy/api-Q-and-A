require('dotenv').config({ path: '.env' });
const { Pool, Client } = require("pg");

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({ connectionString: connectionString });

module.exports = pool;

// const pgp = require("pg-promise")();

// const login = {
//   host: 'localhost',
//   port: 5432,
//   database: 'q_and_a',
//   user: 'postgres',
//   password: 'password'
// };

// const pool = pgp(login);
// module.exports = pool;