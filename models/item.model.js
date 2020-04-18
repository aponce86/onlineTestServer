const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const Item = sequelize.define('Item', {
    weigth: DataTypes.NUMBER,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    cbm: DataTypes.NUMBER,
    insurance: DataTypes.NUMBER,
    owner: DataTypes.NUMBER
}, {
    tableName: 'item'
});

module.exports = Item;