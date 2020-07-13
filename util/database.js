const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://package:A5@KUJpepe123@68.178.217.4:3306/package');

/*
const sequelize = new Sequelize('mysql://quisoft@quisoftdb:Zuniet123@quisoftdb.mysql.database.azure.com:3306/package', {
  dialectOptions: {
    ssl: {}
  }
});
*/



module.exports = sequelize;