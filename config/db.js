const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite is used here for simplicity — no external database server needed.
// The database file will be created automatically at project root as database.sqlite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // set to console.log if you want to see raw SQL queries
});

module.exports = sequelize;
