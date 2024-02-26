require("dotenv").config();
const Sequelize = require("sequelize");
console.log(process.env.DATABASE_DEFAULT_NAME);
const sequelize = new Sequelize(process.env.DATABASE_DEFAULT_NAME, process.env.DATABASE_DEFAULT_USER, process.env.DATABASE_PASSWORD, {
  dialect: "mysql",
  origin: process.env.DATABASE_HOST,
});

module.exports = sequelize;