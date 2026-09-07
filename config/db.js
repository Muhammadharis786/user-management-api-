const { Sequelize } = require('sequelize');
require('dotenv').config();

// PostgreSQL connection setup.
// Values are read from environment variables (.env file) so credentials
// are never hardcoded directly into the source code.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: true, // set to console.log if you want to see raw SQL queries
  }
);

module.exports = sequelize;