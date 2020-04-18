const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const Store = sequelize.define('Store', {
    name: {
        type: DataTypes.STRING
    },
    num: {
        type: DataTypes.NUMBER
    }
}, {
    tableName: 'subsidiary'
});

module.exports = Store;