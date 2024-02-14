const Sequelize = require("sequelize");

const sequelize = new Sequelize("BudgetBharat", "root", "Personal.123@", {
  dialect: "mysql",
  origin: "localhost",
});

module.exports = sequelize;