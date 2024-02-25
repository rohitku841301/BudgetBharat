require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_DEFAULT_NAME, process.env.DATABASE_DEFAULT_USER, process.env.DATABASE_PASSWORD, {
  dialect: "mysql",
  origin: "localhost",
});

module.exports = sequelize;