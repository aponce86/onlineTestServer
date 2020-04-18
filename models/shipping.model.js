const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const Shipping = sequelize.define('Shipping', {
    noShipping: {
        type: DataTypes.STRING
    },
    shippingType: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    storeId: {
        type: DataTypes.NUMBER
    }
}, {
    tableName: 'shipping'
});

module.exports = Shipping;