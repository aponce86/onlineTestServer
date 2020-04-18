const sequelize = require('../util/database');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    emailAddress: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    fullName: {
        type: DataTypes.STRING
    },
    owner: {
        type: DataTypes.NUMBER
    }
}, {
    tableName: 'user'
});

module.exports = User;