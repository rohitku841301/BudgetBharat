const Sequelize = require("sequelize");
const sequelize = require("../database/db");

const File = sequelize.define("file", {
  fileURL: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = File;
