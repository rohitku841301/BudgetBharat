const Sequlize = require("sequelize");
const sequelize = require("../database/db");

const Forget = sequelize.define('forget',{
    id:{
        type: Sequlize.STRING,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequlize.INTEGER,
        allowNull: false
    },
    isActive:{
        type:Sequlize.BOOLEAN,
        allowNull:false
    }
})

module.exports = Forget;