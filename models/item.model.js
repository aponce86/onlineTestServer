const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const Item = sequelize.define('Item', {
    weigth: DataTypes.NUMBER,
    description: DataTypes.STRING,
    status: DataTypes.STRING,
    cbm: DataTypes.NUMBER,
    insurance: DataTypes.NUMBER,
    owner: DataTypes.NUMBER,

    updatedAt: DataTypes.TIME,
    createdAt: DataTypes.TIME
}, {
    tableName: 'item'
});

module.exports = Item;