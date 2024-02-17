const Sequelize = require('sequelize');
const sequelize = require('../database/db');

const Order = sequelize.define("order",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: null,
        primaryKey: true
    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    status: Sequelize.STRING,
})

module.exports = Order;